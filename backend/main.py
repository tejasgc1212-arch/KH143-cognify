"""Start from kuruk with: python -m uvicorn backend.main:app --reload."""

import json
import os
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import ValidationError

from .models import AnalysisResponse, GitHubProfile, JobDetails
from .orchestrator import ROOT, PipelineError, ResumeInput, analyze_candidates, load_environment
from .parsers import MAX_FILE_BYTES, MAX_TEXT_CHARS, MAX_TOTAL_BYTES, DocumentError, extract_text
from .utils import identity


load_environment()
app = FastAPI(title="Cognify — Kurukshetra 2.0 PS03", version="1.0.0")
# The frontend can also be served by Python or VS Code Live Server.
default_origins = "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5501,http://127.0.0.1:5501,http://localhost:8080,http://127.0.0.1:8080"
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", default_origins).split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    # Do not return Pydantic's input field: it can contain resume text or URLs.
    errors = [{"field": ".".join(str(part) for part in error["loc"]), "message": error["msg"]}
              for error in exc.errors()]
    return JSONResponse(status_code=422, content={"detail": "Check the submitted form fields.", "errors": errors})


@app.exception_handler(PipelineError)
async def pipeline_error(request: Request, exc: PipelineError):
    return JSONResponse(status_code=exc.status_code, content={"detail": str(exc),
                        "errors": [error.model_dump() for error in exc.errors]})


@app.exception_handler(Exception)
async def unexpected_error(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Analysis could not be completed. Please try again."})


@app.get("/api/health")
def health():
    # Health works without importing agents, prompting for input, or making API calls.
    return {"status": "ok"}


def parse_profiles(value: str, resume_count: int) -> list[GitHubProfile]:
    try:
        raw = json.loads(value or "[]")
        if not isinstance(raw, list) or len(raw) > 100:
            raise ValueError("Expected an array of at most 100 profiles")
        profiles = [GitHubProfile.model_validate(item) for item in raw]
        selectors = set()
        for profile in profiles:
            if profile.resumeIndex is not None:
                if profile.resumeIndex >= resume_count:
                    raise ValueError("resumeIndex is outside the uploaded resume list")
                selector = ("index", profile.resumeIndex)
            elif profile.resumeFilename:
                selector = ("filename", identity(profile.resumeFilename))
            else:
                selector = ("name", identity(profile.candidateName))
            if selector in selectors:
                raise ValueError("Duplicate GitHub candidate selector")
            selectors.add(selector)
        return profiles
    except (ValueError, TypeError, RecursionError):
        raise HTTPException(422, "githubProfiles must be a JSON array of unique entries with githubURL and exactly one of candidateName, resumeFilename, or a valid zero-based resumeIndex.") from None


def read_upload(upload: UploadFile) -> bytes:
    # Read at most one byte beyond the limit instead of loading arbitrary files.
    content = upload.file.read(MAX_FILE_BYTES + 1)
    if len(content) > MAX_FILE_BYTES:
        raise DocumentError("Each file must be 10 MB or smaller.")
    return content


@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze(
    jobRole: Annotated[str, Form(min_length=1, max_length=100)],
    resumes: Annotated[list[UploadFile], File(description="One or more PDF, DOCX, or TXT resumes")],
    department: Annotated[str, Form(max_length=100)] = "",
    minimumExperience: Annotated[str, Form(max_length=20)] = "",
    location: Annotated[str, Form(max_length=100)] = "",
    employmentType: Annotated[str, Form(max_length=100)] = "",
    jobDescription: Annotated[str, Form(max_length=MAX_TEXT_CHARS)] = "",
    jobDescriptionFile: Annotated[UploadFile | None, File()] = None,
    githubProfiles: Annotated[str, Form(max_length=50_000)] = "[]",
):
    # This sync route runs in FastAPI's worker thread pool, so blocking original
    # LangChain/requests calls do not block health checks or the event loop.
    if not 1 <= len(resumes) <= 100:
        raise HTTPException(422, "Upload between 1 and 100 resumes.")
    try:
        details = JobDetails(jobRole=jobRole, department=department,
                             minimumExperience=minimumExperience.strip() or None,
                             location=location, employmentType=employmentType)
    except ValidationError:
        raise HTTPException(422, "Provide a job role and a minimumExperience between 0 and 50 years, or leave experience blank.") from None
    profiles = parse_profiles(githubProfiles, len(resumes))
    # UploadFile.size is populated by the multipart parser, before agent calls.
    uploads = resumes + ([jobDescriptionFile] if jobDescriptionFile else [])
    if sum(upload.size or 0 for upload in uploads) > MAX_TOTAL_BYTES:
        raise HTTPException(413, "The combined uploads must be 50 MB or smaller.")
    job_text = jobDescription.strip()
    total_bytes = 0
    if jobDescriptionFile:
        try:
            content = read_upload(jobDescriptionFile)
            total_bytes += len(content)
            file_text = extract_text(jobDescriptionFile.filename or "", content)
            if file_text != job_text:
                job_text = "\n\n".join(part for part in (job_text, file_text) if part)
        except DocumentError as exc:
            raise HTTPException(422, "Job description: " + str(exc)) from None
    if not job_text:
        raise HTTPException(422, "Paste a job description or upload a readable job description file.")
    if len(job_text) > MAX_TEXT_CHARS:
        raise HTTPException(422, "The combined job description exceeds 100,000 characters.")
    inputs = []
    for index, upload in enumerate(resumes):
        # Strip browser-supplied paths; these names are labels, never disk paths.
        filename = Path((upload.filename or "unnamed").replace("\\", "/")).name[:255]
        resume = ResumeInput(index=index, filename=filename)
        try:
            content = read_upload(upload)
            total_bytes += len(content)
            if total_bytes > MAX_TOTAL_BYTES:
                raise HTTPException(413, "The combined uploads must be 50 MB or smaller.")
            resume.text = extract_text(filename, content)
        except DocumentError as exc:
            resume.error = str(exc)
        inputs.append(resume)
    return analyze_candidates(details, job_text, inputs, profiles)


# Serve only frontend/, never the project root or its .env files. This also
# avoids cross-origin setup when the user opens the recommended URL.
@app.get("/", include_in_schema=False)
def frontend_redirect():
    return RedirectResponse("/frontend/")


app.mount("/frontend", StaticFiles(directory=ROOT / "frontend", html=True), name="frontend")
