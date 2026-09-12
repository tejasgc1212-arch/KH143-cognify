"""Run the original six agents and adapt their output for the existing UI."""

from collections import Counter
from dataclasses import dataclass
from functools import lru_cache
from importlib import import_module
import json
import os
from pathlib import Path
from uuid import uuid4

from dotenv import load_dotenv
import requests

from .models import AnalysisResponse, CandidateError, CandidateResult, GitHubProfile, JobDetails
from .utils import AgentOutputError, field, identity, normalize_agent_output, score_value, string_list, text_value, years_value


ROOT = Path(__file__).resolve().parent.parent
MAX_GITHUB_REPOS = 3


def load_environment() -> None:
    # Explicit paths work whether Uvicorn starts from the project or its parent.
    # Existing process variables win. Never print or write credential values.
    for path in (ROOT / ".env", ROOT / "backend/.env", ROOT / "agents/.env", ROOT / "Agents/.env",
                 ROOT / "Agents/.venv/.env"):
        if path.is_file():
            load_dotenv(path, override=False)


class PipelineError(Exception):
    def __init__(self, message: str, status_code: int = 502, errors: list | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.errors = errors or []


@dataclass
class ResumeInput:
    index: int
    filename: str
    text: str = ""
    error: str | None = None


class ExistingAgents:
    """Only import and call existing chains; there are no replacement prompts."""

    def __init__(self):
        # Git tracks 'agents'; the user's Windows folder is displayed as 'Agents'.
        # Path.exists() is case-insensitive on Windows, while Python imports
        # still need the real directory spelling. Read it from the directory.
        package = next(path.name for path in ROOT.iterdir()
                       if path.is_dir() and path.name.casefold() == "agents")
        self.modules = {
            stage: import_module(f"{package}.{module}")
            for stage, module in {
                "job": "description", "resume": "resume", "github": "github",
                "matching": "matching", "skill_gap": "skill", "summary": "summary",
            }.items()
        }

    def invoke(self, stage: str, payload: dict):
        return self.modules[stage].chain.invoke(payload)

    def github_data(self, url: str):
        return self.modules["github"].get_github_data(url)


@lru_cache(maxsize=1)
def get_agents() -> ExistingAgents:
    load_environment()
    if not os.getenv("OPENROUTER_API_KEY"):
        raise PipelineError("OPENROUTER_API_KEY is not configured. Set it in your existing agents/.env file and restart the server.", 503)
    # This is a public service address, never a credential.
    os.environ.setdefault("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    try:
        return ExistingAgents()
    except Exception:
        raise PipelineError("The existing agents could not be loaded. Check Python dependencies and OpenRouter configuration.", 503) from None


def run_agent(agents, stage: str, payload: dict) -> dict:
    # Dicts are serialized once at the boundary expected by the original prompts.
    inputs = {key: json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else value
              for key, value in payload.items()}
    output = normalize_agent_output(agents.invoke(stage, inputs))
    if not output:
        raise AgentOutputError("The agent returned an empty result.")
    return output


def job_information(output: dict, details: JobDetails) -> dict:
    return {
        **details.model_dump(),
        "jobRole": details.jobRole,
        "requiredSkills": string_list(field(output, "required_skills")),
        "preferredSkills": string_list(field(output, "preferred_skills")),
        "minimumExperience": details.minimumExperience if details.minimumExperience is not None else years_value(
            field(output, "minimum_experience", "required_experience")),
        "experienceRequirement": text_value(field(output, "required_experience", "minimum_experience")),
        "education": text_value(field(output, "education_requirements", "education")),
        "responsibilities": string_list(field(output, "responsibilities")),
        "agentOutput": output,
    }


def repository_urls(url: str) -> list[str]:
    parts = url.removeprefix("https://github.com/").split("/")
    if len(parts) == 2:
        return [url]
    response = requests.get(
        f"https://api.github.com/users/{parts[0]}/repos",
        params={"sort": "updated", "per_page": 30, "type": "owner"},
        headers={"Accept": "application/vnd.github+json"}, timeout=15,
    )
    response.raise_for_status()
    repos = response.json()
    if not isinstance(repos, list):
        raise ValueError("Unexpected repository response")
    urls = []
    for repo in repos:
        if repo.get("fork") or repo.get("archived"):
            continue
        # Validate the API's repository URLs using the same upload validation.
        profile = GitHubProfile(resumeIndex=0, githubURL=repo["html_url"])
        urls.append(profile.githubURL)
        if len(urls) == MAX_GITHUB_REPOS:
            break
    return urls


def github_information(agents, url: str | None) -> tuple[dict, list[str]]:
    if not url:
        return {"status": "not_provided", "projects": [], "note": "No GitHub URL supplied; use resume claims and projects without GitHub verification."}, []
    warnings = []
    projects = []
    try:
        urls = repository_urls(url)
    except Exception:
        return {"status": "unavailable", "projects": []}, ["GitHub could not be reached or is rate limited. Continuing with the resume."]
    for repo_url in urls:
        try:
            # Reuse the user's requests helper and GitHub chain, including its prompt.
            data = agents.github_data(repo_url)
            if not data or data == "GitHub repository not found":
                raise ValueError("Repository unavailable")
            output = run_agent(agents, "github", {"github_data": data[:40_000]})
            projects.append({"url": repo_url, "name": repo_url.rsplit("/", 1)[-1], "analysis": output})
        except Exception:
            warnings.append("A GitHub repository could not be analyzed; its evidence was omitted.")
    if not urls:
        warnings.append("No eligible public repositories were found for this profile.")
    status = "partial" if projects and warnings else "available" if projects else "unavailable"
    return {"status": status, "projects": projects, "repositoryLimit": MAX_GITHUB_REPOS,
            "note": "Profile evidence covers up to three recently updated, non-fork public repositories. Repository ownership alone does not prove individual authorship."}, warnings


def find_profile(resume: ResumeInput, name: str, names: Counter, filenames: Counter,
                 profiles: list[GitHubProfile], used: set[int]) -> tuple[str | None, list[str]]:
    matches = []
    warnings = []
    for index, profile in enumerate(profiles):
        if profile.resumeIndex == resume.index:
            matches.append((index, profile))
        elif profile.resumeFilename and identity(profile.resumeFilename) == identity(resume.filename):
            if filenames[identity(resume.filename)] == 1:
                matches.append((index, profile))
            else:
                warnings.append("Duplicate resume filenames make the GitHub association ambiguous. Use resumeIndex.")
        elif profile.candidateName and identity(profile.candidateName) == identity(name):
            if names[identity(name)] == 1:
                matches.append((index, profile))
            else:
                warnings.append("Duplicate candidate names make the GitHub association ambiguous. Use resumeFilename or resumeIndex.")
    if len(matches) > 1:
        return None, warnings + ["Multiple GitHub entries match this candidate; no profile was assigned."]
    if matches:
        index, profile = matches[0]
        used.add(index)
        return profile.githubURL, warnings
    return None, warnings


def candidate_result(resume: ResumeInput, job: dict, outputs: dict, url: str | None, warnings: list[str]) -> CandidateResult:
    resume_data, matching, gaps, summary, github = (outputs[key] for key in ("resume", "matching", "skill_gap", "summary", "github"))
    score = score_value(field(matching, "candidate_match_score", "match_score", "overall_match_score", "final_match_score", "total_score", "score"))
    if score is None:
        raise AgentOutputError("The matching agent did not return a valid score out of 100.")
    name = text_value(field(resume_data, "name", "candidate_name", "candidate"), resume.filename)
    components = field(matching, "score_breakdown", "scores", "breakdown", default=matching)
    if not isinstance(components, dict):
        components = matching

    def component(maximum, *keys):
        value = score_value(field(components, *keys), maximum)
        return round(value / maximum * 100, 2) if value is not None else None

    missing = string_list(field(matching, "missing_skills"))
    skill_gaps = []
    for label, importance in (("critical_skill_gaps", "High"), ("partial_skill_gaps", "Medium"),
                              ("experience_gap", "High"), ("education_gap", "Medium")):
        for item in string_list(field(gaps, label)):
            skill_gaps.append({"title": item, "importance": importance, "evidence": item})
    if not skill_gaps:
        skill_gaps = [{"title": item, "importance": "Unspecified", "evidence": item} for item in missing]
    recommendation = text_value(field(summary, "final_recommendation", "recommendation"),
                                text_value(field(matching, "final_recommendation"), "Review required"))
    # These labels only adapt the display; the original score is never recalculated.
    fit = {"Strongly Recommend": "Strong Fit", "Strong Match": "Strong Fit", "Recommend": "Good Fit",
           "Good Match": "Good Fit", "Consider": "Consider", "Moderate Match": "Consider",
           "Not Recommended": "Low Fit", "Weak Match": "Low Fit"}.get(recommendation, recommendation)
    projects = []
    for project in github["projects"]:
        analysis = project["analysis"]
        projects.append({
            "name": project["name"], "url": project["url"],
            "technologies": string_list(field(analysis, "technologies_used", "programming_languages")),
            "score": score_value(field(analysis, "project_score", "score")),
            "reason": text_value(field(analysis, "project_purpose", "strengths", "raw_text")),
        })
    return CandidateResult(
        id=uuid4().hex, filename=resume.filename, resumeIndex=resume.index, name=name,
        initials="".join(part[0] for part in name.split()[:2]).upper(), role=job["jobRole"],
        matchScore=score, skillsMatch=component(40, "required_skills", "required_skills_match"),
        experienceMatch=component(20, "experience", "experience_match"),
        projectEvidence=component(25, "github_evidence", "github_evidence_projects"),
        experience=years_value(field(resume_data, "experience_years", "total_experience", "experience")),
        minimumExperience=job["minimumExperience"],
        github={"available": "Available", "partial": "Partial", "unavailable": "Unavailable", "not_provided": "Not Provided"}[github["status"]],
        githubURL=url, recommendation=fit, matchedSkills=string_list(field(matching, "matched_skills")),
        missingSkills=missing, resumeSkills=string_list(field(resume_data, "skills")),
        resumeProjects=string_list(field(resume_data, "projects")),
        education=text_value(field(resume_data, "education")),
        experienceSummary=text_value(field(resume_data, "experience")),
        strengths=string_list(field(summary, "key_strengths", "main_strengths", "strengths", "strongest_skills")),
        concerns=string_list(field(summary, "main_concerns", "concerns", "important_gaps")) + warnings,
        summary=text_value(field(summary, "recruiter_summary", "summary", "raw_text")),
        nextStep=recommendation, projects=projects, skillGaps=skill_gaps, warnings=warnings, agentOutputs=outputs,
    )


def analyze_candidates(details: JobDetails, job_text: str, resumes: list[ResumeInput],
                       profiles: list[GitHubProfile], agents=None) -> AnalysisResponse:
    """One job call, separate candidate calls, then descending score order.

    An injected agents object makes integration tests possible without API calls.
    Results stay in this request; no global candidate or recruiter state is kept.
    """
    errors = [CandidateError(resumeIndex=item.index, filename=item.filename, stage="parsing", message=item.error)
              for item in resumes if item.error]
    if len(errors) == len(resumes):
        raise PipelineError("No readable resumes were uploaded.", 422, errors)
    agents = agents or get_agents()
    metadata = details.model_dump(exclude_none=True)
    context = "Recruiter-provided job details:\n" + json.dumps(metadata, ensure_ascii=False) + "\n\nJob description:\n" + job_text
    try:
        job_output = run_agent(agents, "job", {"job_description": context})
    except Exception:
        raise PipelineError("The Job Description Agent failed. Check OpenRouter availability and try again.") from None
    job = job_information(job_output, details)

    # Parse names before associating profiles, so duplicate names never receive
    # another candidate's evidence. Filename or zero-based index is unambiguous.
    parsed = []
    for resume in resumes:
        if resume.error:
            continue
        try:
            output = run_agent(agents, "resume", {"resume": resume.text})
            name = text_value(field(output, "name", "candidate_name", "candidate"), resume.filename)
            parsed.append((resume, output, name))
        except Exception:
            errors.append(CandidateError(resumeIndex=resume.index, filename=resume.filename, stage="resume",
                                         message="The Resume Agent failed. Retry this candidate."))
    names = Counter(identity(name) for _, _, name in parsed)
    filenames = Counter(identity(item.filename) for item in resumes)
    candidates = []
    used_profiles = set()
    for resume, resume_output, name in parsed:
        url, warnings = find_profile(resume, name, names, filenames, profiles, used_profiles)
        github, github_warnings = github_information(agents, url)
        warnings.extend(github_warnings)
        stage = "matching"
        try:
            matching = run_agent(agents, stage, {"job_data": job, "resume_data": resume_output, "github_data": github})
            # A missing score must not become a fabricated zero in the ranking.
            if score_value(field(matching, "candidate_match_score", "match_score", "overall_match_score", "final_match_score", "total_score", "score")) is None:
                raise AgentOutputError("Missing score")
            stage = "skill_gap"
            gaps = run_agent(agents, stage, {"job_data": job, "match_data": matching})
            stage = "summary"
            summary = run_agent(agents, stage, {"resume_data": resume_output, "github_data": github,
                                                "match_data": matching, "skill_gap_data": gaps})
            stage = "normalization"
            outputs = {"job": job_output, "resume": resume_output, "github": github,
                       "matching": matching, "skill_gap": gaps, "summary": summary}
            candidates.append(candidate_result(resume, job, outputs, url, warnings))
        except Exception:
            errors.append(CandidateError(resumeIndex=resume.index, filename=resume.filename, stage=stage,
                                         message=f"The {stage.replace('_', ' ')} stage failed or returned an unusable result. Retry this candidate."))
    if not candidates:
        raise PipelineError("No candidates completed analysis. Check the candidate errors and retry.", 502, errors)
    candidates.sort(key=lambda candidate: candidate.matchScore, reverse=True)
    for rank, candidate in enumerate(candidates, start=1):
        candidate.rank = rank
    warnings = []
    if len(used_profiles) < len(profiles):
        warnings.append("Some GitHub entries could not be uniquely associated with a resume. Use the exact extracted candidate name, resumeFilename, or resumeIndex.")
    return AnalysisResponse(
        analysisId=uuid4().hex, status="partial" if errors else "completed", job=job, candidates=candidates,
        errors=sorted(errors, key=lambda error: error.resumeIndex), warnings=warnings,
        totalCandidates=len(resumes), processedCandidates=len(candidates),
    )
