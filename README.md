# recruitment agent

The existing frontend now sends real resume uploads to a Python FastAPI backend.
The backend reuses all six original LangChain/OpenRouter chains. The frontend's
layout, CSS, sample data, search, filters, tabs, shortlist, and text reports remain
available. Dashboard, Analytics, and sidebar totals use the current candidates,
with zero/empty states until an analysis completes. Charts and skill counts use
those same results.

## Run on Windows

Open PowerShell in `kuruk`:

```powershell
cd 'C:\Users\Ganesh Chavan\Documents\kuruk'
uv --system-certs pip install --python '.\Agents\.venv\Scripts\python.exe' -r backend/requirements.txt
& '.\Agents\.venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open **http://127.0.0.1:8000/frontend/**. API documentation is at
**http://127.0.0.1:8000/docs**. Stop Uvicorn with `Ctrl+C`.

`uv` is already installed on this computer, and the existing agent environment
does not contain pip. On a fresh computer with Python 3.10+ and pip, you can instead
create a virtual environment and install the same requirements:

```powershell
python -m venv .venv
& '.\.venv\Scripts\python.exe' -m pip install -r backend/requirements.txt
& '.\.venv\Scripts\python.exe' -m uvicorn backend.main:app --reload
```

No JavaScript package installation or Node.js server is required.

## Environment configuration

Keep using your existing `Agents/.env` with `OPENROUTER_API_KEY` and
`OPENROUTER_BASE_URL`. This integration does not change or print either value.
The backend loads environment files by absolute project paths before importing
the agents. Existing process environment variables take precedence. It checks
the project root, `backend/`, and `agents/` / `Agents/`, with the original
`Agents/.venv/.env` location retained as a legacy fallback.

If no base URL is set, the backend uses `https://openrouter.ai/api/v1`.
The original `openrouter/free` model selection is unchanged. Provider availability,
quotas, and model output quality still affect real analyses.

Optional `CORS_ORIGINS` is a comma-separated list of frontend origins. The default
allows localhost and 127.0.0.1 on ports 5500, 5501, and 8080. Serving the frontend
through Uvicorn is the easiest setup. Direct `file://` pages should use the server
URL above for real analysis. `window.COGNIFY_API_BASE_URL` can be set before loading
`api.js` if a separate frontend uses another backend address.

## Project structure inspected

The starting project contained three frontend files and six agent scripts. There
was no backend directory. Windows displays the agent folder as `Agents`, while
the original Git paths use `agents`; imports support either spelling.

```text
kuruk/
  agents/                    # Existing folder, shown as Agents on this computer
    description.py           # Existing job-description chain
    resume.py                # Existing resume chain and read_resume helper
    github.py                # Existing repository fetch helper and evidence chain
    matching.py              # Existing scoring rules and chain
    skill.py                 # Existing gap-analysis chain
    summary.py               # Existing recruiter-summary chain
    requirment.txt           # Original dependency list, preserved
    .env                     # Existing credentials, unchanged
  backend/
    __init__.py
    main.py                  # FastAPI, CORS, upload validation, static frontend
    orchestrator.py          # Calls existing chains; associates and ranks applicants
    parsers.py               # PDF, DOCX, TXT extraction
    models.py                # Validated input and frontend-compatible output
    utils.py                 # JSON/AIMessage/Markdown normalization
    requirements.txt
    requirements-dev.txt
  frontend/
    index.html               # Existing markup, small integration/text changes
    style.css                # Unchanged
    script.js                # Existing interactions plus real request lifecycle
    api.js                   # Multipart request and API error handling
  tests/
    test_agent_imports.py      # Actual original module import/input contracts
    test_backend.py
    test_frontend.py
    test_frontend_state.py     # Shared statistics, history, numeric/storage cases
```

The original `resume.read_resume(file_path)` remains available for its PDF CLI
demo. Uploaded documents use an in-memory parser, then pass extracted text to the
original resume chain so DOCX and TXT work without changing agent logic.

## Existing agent contracts

Each original module exposes `prompt`, `model`, and `chain`. Calls return an
AIMessage, usually with labeled prose; the adapter also accepts dictionaries,
JSON strings, fenced JSON, and message text blocks.

| Agent | Original callable | Required input keys | Original output information |
| --- | --- | --- | --- |
| Job Description | `description.chain.invoke` | `job_description` | Role, skills, experience, education, responsibilities, tools, keywords |
| Resume | `resume.chain.invoke` | `resume` | Name, skills, education, experience, projects, certifications |
| GitHub | `github.get_github_data`, then `github.chain.invoke` | Repository URL, then `github_data` | Project purpose, languages, quality, demonstrated skills, project score |
| Matching | `matching.chain.invoke` | `job_data`, `resume_data`, `github_data` | Match score, score components, matched/missing/verified skills, recommendation |
| Skill Gap | `skill.chain.invoke` | `job_data`, `match_data` | Critical/partial gaps, experience and education gaps, improvements |
| Recruiter Summary | `summary.chain.invoke` | `resume_data`, `github_data`, `match_data`, `skill_gap_data` | Summary, strengths, concerns, recommendation, original matching score |

Only import guards and bounded API waits/retries were added to the agents.
GitHub HTTP calls also have timeouts. Original prompts, the original chains, and
the Matching Agent's 40/25/20/10/5 point scoring rules are preserved.

## API

`GET /api/health` returns `{"status":"ok"}`. It makes no provider requests and
works without an API key. It checks server liveness, not provider availability.

`POST /api/analyze` accepts **multipart/form-data**:

| Field | Format |
| --- | --- |
| `jobRole` | Required text, up to 100 characters |
| `department` | Optional text |
| `minimumExperience` | Years from 0 to 50; blank means unspecified |
| `location` | Optional text |
| `employmentType` | Optional text |
| `jobDescription` | Pasted text; required unless a readable JD file is supplied |
| `jobDescriptionFile` | Optional PDF, DOCX, or TXT |
| `resumes` | Repeat this field for each of 1–100 files |
| `githubProfiles` | JSON array encoded as a form string; defaults to `[]` |

Example GitHub entries, using exactly one candidate selector per entry:

```json
[
  {"candidateName": "Alice Example", "githubURL": "https://github.com/example"},
  {"resumeFilename": "bob_resume.pdf", "githubURL": "https://github.com/example/project"},
  {"resumeIndex": 2, "githubURL": "https://github.com/example/another-project"}
]
```

`resumeIndex` is zero-based upload order. Candidate-name matching uses the name
extracted by the Resume Agent, ignoring capitalization and extra whitespace.
Duplicate names or filenames are never guessed: use an index for those cases.
Unmatched or ambiguous associations are reported as warnings. Profile URLs are
resolved to up to three recently updated, non-fork, non-archived public repositories
from the first 30 results. A supplied repository URL is analyzed directly.

Pasted and uploaded job descriptions are combined, with identical text included
only once. The Job Description Agent runs once. Resume analysis identifies each
applicant before evidence association, then the matching → gap → summary stages
run separately for each candidate. Missing/unavailable GitHub evidence is nonfatal.

Successful responses contain:

```text
analysisId, status (completed or partial), job,
candidates (sorted by matchScore descending, with rank),
errors (filename, resumeIndex, stage, message), warnings,
totalCandidates, processedCandidates
```

Candidate fields match the existing frontend, including `name`, `matchScore`,
`skillsMatch`, `experienceMatch`, `projectEvidence`, `experience`, `github`,
`matchedSkills`, `missingSkills`, `projects`, `summary`, and `recommendation`.
`agentOutputs` retains each agent's structured output and any original prose.
The overall score always comes from the Matching Agent. UI component percentages
convert its points to percentages using the existing component maxima. Missing
component scores/experience are `null` and display as “Not reported”. A candidate
without a valid final score is reported as an error, never ranked with an invented
zero. The summary cannot overwrite the score.

Some candidates can fail while the response still returns HTTP 200 with
`status: "partial"` and the completed candidates. HTTP 422 reports invalid input
or a batch with no readable resumes; 413 reports excessive total upload size;
502 reports provider/agent failure with no completed results; 503 reports missing
provider configuration or dependencies. Exceptions never return provider diagnostics
or raw request bodies.

## Limits and current scope

- Up to 100 resumes; 10 MB per file and 50 MB total uploads.
- At most 100 PDF pages and 100,000 extracted characters per document; the
  combined job description also has a 100,000-character limit.
- Text PDFs are supported. Scans need OCR first; encrypted PDFs need their password
  removed. Legacy `.doc` files should be converted to `.docx`.
- Documents are processed in memory after multipart parsing. The framework may
  spool uploads to temporary files and closes them after the request. No candidate
  database, upload archive, or background job queue is added. The browser stores
  real analysis responses, timestamps, and per-analysis shortlist IDs in
  localStorage (`cognify-results-v1`). Reloading restores the selected real result;
  Recent Job Analyses can reopen saved results. Storage is local to the browser
  and origin. If storage is disabled or full, results remain in memory.
- AI document text is sent to the configured OpenRouter service during real runs.
  Browser sample runs make no AI calls. Public GitHub metadata/README content is
  fetched only for supplied candidate URLs.
- Existing agents run sequentially, with up to 60 seconds per model request and
  one retry. Large batches can take several minutes. The browser waits for the
  batch and displays an indeterminate indicator, without simulated live progress
  or stage claims. Keep the page open until results arrive.
- GitHub availability does not prove authorship; public evidence is labeled
  “Available”. The original agent evaluates the repository metadata and README.
  Dashboard and Analytics count only the exact status “Verified” as verified.
  The Candidates summary counts Available, Partial, and Verified as evidence.
- Current totals use completed candidates, not the submitted resume count.
  Average match uses valid scores from 0 to 100, rounded to a whole percentage;
  null/blank/invalid scores are excluded. Match buckets count scored candidates
  and identify unscored results. Skills count each candidate once per skill.
  Role counts aggregate saved real analyses (or the active sample run); other
  metrics describe the selected analysis.
- Sample runs require “Use Sample Data” and submission. They stay in memory,
  display only sample metrics, and never enter or overwrite saved real history.
  A successful real run replaces sample results and resets the current shortlist.
  Old standalone demo shortlist IDs are intentionally not restored.

## Tests

```powershell
uv --system-certs pip install --python '.\Agents\.venv\Scripts\python.exe' -r backend/requirements-dev.txt
& '.\Agents\.venv\Scripts\python.exe' -m pytest tests -q
```

Tests use synthetic files and stub only external provider/GitHub calls. Backend
checks cover normalization, parsing, validation, candidate isolation, ranking,
profile association, CORS, and partial failures. The browser test starts a temporary
FastAPI server and drives the actual frontend using headless Edge on Windows.
On another platform install a Playwright Chromium browser with
`python -m playwright install chromium` first.

State regressions cover one, three, then two resumes through the real multipart
endpoint and adapter, exact Verified counts, a 90/80/70 average of 80, shortlist
add/remove, filters, history restoration, sample isolation, partial responses,
missing scores, and unavailable/corrupt storage. Endpoint response fixtures cover
statuses and null scores the current backend does not emit.

These tests do not verify live OpenRouter availability, credentials, quotas, or
the quality of a real model response.

Implementation references: [FastAPI multipart forms and files](https://fastapi.tiangolo.com/tutorial/request-forms-and-files/),
[FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/), and
[GitHub public repository API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user).
