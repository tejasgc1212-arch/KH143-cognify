"""The API keeps camelCase fields to match the existing JavaScript frontend."""

import re
from typing import Any, Literal
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class JobDetails(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    jobRole: str = Field(min_length=1, max_length=100)
    department: str = Field(default="", max_length=100)
    minimumExperience: float | None = Field(default=None, ge=0, le=50)
    location: str = Field(default="", max_length=100)
    employmentType: str = Field(default="", max_length=100)


class GitHubProfile(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    candidateName: str | None = Field(default=None, min_length=1, max_length=100)
    resumeFilename: str | None = Field(default=None, min_length=1, max_length=255)
    resumeIndex: int | None = Field(default=None, ge=0, le=99, strict=True)
    githubURL: str = Field(max_length=250)

    @field_validator("githubURL")
    @classmethod
    def validate_url(cls, value: str) -> str:
        url = urlparse(value)
        parts = url.path.strip("/").split("/")
        if (url.scheme not in {"http", "https"} or url.hostname not in {"github.com", "www.github.com"}
                or url.username or url.password or url.port or url.query or url.fragment
                or len(parts) not in {1, 2} or not re.fullmatch(r"[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?", parts[0])
                or (len(parts) == 2 and not re.fullmatch(r"[A-Za-z0-9_.-]+", parts[1]))
                or any(part in {".", ".."} for part in parts)):
            raise ValueError("Use a GitHub profile or repository URL.")
        return "https://github.com/" + "/".join(parts)

    @model_validator(mode="after")
    def require_one_identity(self):
        if sum(value is not None for value in (self.candidateName, self.resumeFilename, self.resumeIndex)) != 1:
            raise ValueError("Specify exactly one of candidateName, resumeFilename, or resumeIndex.")
        return self


class CandidateError(BaseModel):
    resumeIndex: int
    filename: str
    stage: str
    message: str


class ProjectEvidence(BaseModel):
    name: str
    technologies: list[str] = Field(default_factory=list)
    score: float | None = Field(default=None, ge=0, le=100)
    reason: str
    url: str


class SkillGap(BaseModel):
    title: str
    importance: str
    evidence: str


class CandidateResult(BaseModel):
    id: str
    rank: int = 0
    source: Literal["analysis"] = "analysis"
    filename: str
    resumeIndex: int
    name: str
    initials: str
    role: str
    matchScore: float = Field(ge=0, le=100)
    skillsMatch: float | None = None
    experienceMatch: float | None = None
    projectEvidence: float | None = None
    experience: float | None = None
    minimumExperience: float | None = None
    github: str
    githubURL: str | None = None
    recommendation: str
    color: str = "purple"
    matchedSkills: list[str] = Field(default_factory=list)
    missingSkills: list[str] = Field(default_factory=list)
    resumeSkills: list[str] = Field(default_factory=list)
    resumeProjects: list[str] = Field(default_factory=list)
    education: str
    experienceSummary: str
    strengths: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)
    summary: str
    nextStep: str
    projects: list[ProjectEvidence] = Field(default_factory=list)
    skillGaps: list[SkillGap] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    agentOutputs: dict[str, dict[str, Any]] = Field(default_factory=dict)


class AnalysisResponse(BaseModel):
    analysisId: str
    status: Literal["completed", "partial"]
    job: dict[str, Any]
    candidates: list[CandidateResult]
    errors: list[CandidateError] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    totalCandidates: int
    processedCandidates: int
