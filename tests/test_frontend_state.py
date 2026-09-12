"""Dashboard/state regression checks in a real browser; no remote AI calls."""

import json
from pathlib import Path
import re

from playwright.sync_api import expect, sync_playwright
import pytest

from test_frontend import live_server


@pytest.fixture
def state_page(live_server):
    url, fake = live_server
    edge = Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True, executable_path=str(edge) if edge.exists() else None
        )
        context = browser.new_context()
        errors = []
        context.on("page", lambda opened: opened.on("pageerror", lambda error: errors.append(str(error))))
        page = context.new_page()
        page.goto(url)
        yield page, fake
        browser.close()
        assert errors == []


def upload(page, names, role="Python Developer"):
    page.locator('.nav-item[data-section="new-analysis"]').click()
    page.locator("#job-role").fill(role)
    page.locator("#job-description").fill("Build Python APIs.")
    while page.locator(".uploaded-file .remove-button").count():
        page.locator(".uploaded-file .remove-button").first.click()
    page.locator("#resume-files").set_input_files([
        {"name": f"resume-{index}.txt", "mimeType": "text/plain",
         "buffer": (name + "\nPython APIs").encode()}
        for index, name in enumerate(names)
    ])
    with page.expect_response("**/api/analyze") as response:
        page.locator("#run-analysis-button").click()
    assert response.value.ok
    expect(page.locator("#candidates")).to_be_visible()
    return response.value.json()


def assert_totals(page, total, average, shortlisted=0, verified=0):
    for prefix in ("dashboard", "analytics"):
        expect(page.locator(f"#{prefix}-total-candidates")).to_have_text(str(total))
        expect(page.locator(f"#{prefix}-average-match")).to_have_text(str(average))
        expect(page.locator(f"#{prefix}-shortlisted")).to_have_text(str(shortlisted))
        expect(page.locator(f"#{prefix}-github-verified")).to_have_text(str(verified))
    expect(page.locator(".nav-count")).to_have_text(str(total))
    expect(page.locator("#candidate-total")).to_have_text(str(total))


def chart_counts(page, selector):
    return [int(text.split()[0]) for text in page.locator(selector).all_text_contents()]


def response_payload(scores, statuses=None, role="Data Engineer", analysis_id="fixture"):
    statuses = statuses or ["Not Provided"] * len(scores)
    return {
        "analysisId": analysis_id, "job": {"jobRole": role}, "status": "completed",
        "totalCandidates": len(scores), "processedCandidates": len(scores),
        "warnings": [], "errors": [],
        "candidates": [
            {
                "id": f"candidate-{index}", "rank": index + 1, "source": "analysis",
                "filename": f"resume-{index}.txt", "resumeIndex": index,
                "name": f"Candidate {index}", "initials": f"C{index}", "role": role,
                "matchScore": score, "skillsMatch": None, "experienceMatch": None,
                "projectEvidence": None, "experience": None, "minimumExperience": None,
                "github": statuses[index], "githubURL": None, "color": "purple",
                "recommendation": "Consider", "matchedSkills": [], "missingSkills": [],
                "education": "", "experienceSummary": "", "strengths": [],
                "concerns": [], "summary": "", "nextStep": "", "projects": [],
                "skillGaps": [], "warnings": [],
            }
            for index, score in enumerate(scores)
        ],
    }


def deliver_response(page, payload):
    # Exercises api.js and the real POST success path with response edge cases
    # that the current backend does not emit (Verified, null scores).
    page.route("**/api/analyze", lambda route: route.fulfill(json=payload))
    upload(page, [f"Candidate {index}" for index in range(len(payload["candidates"]))],
           payload["job"]["jobRole"])
    page.unroute("**/api/analyze")


def test_empty_state_and_real_one_three_two_resume_runs(state_page):
    page, fake = state_page
    assert_totals(page, 0, 0)
    expect(page.locator("#recent-analyses-body")).to_contain_text("No analysis data yet")
    for chart in ("distribution", "skills", "gaps", "roles"):
        expect(page.locator("#analytics-" + chart)).to_have_text("No analysis data yet")
    page.locator('.nav-item[data-section="candidates"]').click()
    expect(page.locator("#candidate-empty-state")).to_contain_text("No analysis data yet")

    original = fake.invoke

    def scored_response(stage, payload):
        result = original(stage, payload)
        if stage == "matching":
            score = int(json.loads(payload["resume_data"])["name"].split()[-1])
            return re.sub(r"Candidate Match Score: \d+/100",
                          f"Candidate Match Score: {score}/100", result)
        return result

    fake.invoke = scored_response

    # A: actual browser multipart upload -> FastAPI -> existing adapter -> UI.
    first = upload(page, ["Candidate 90"])
    assert len(first["candidates"]) == 1
    assert_totals(page, 1, 90)
    expect(page.locator("#recent-analyses-body tr")).to_have_count(1)
    expect(page.locator("#analytics-roles")).to_contain_text("1 candidate")

    # B/D: three completed results; averages and buckets use these exact scores.
    upload(page, ["Candidate 90", "Candidate 80", "Candidate 70"])
    assert_totals(page, 3, 80)
    assert chart_counts(page, "#dashboard .chart-bar > span") == [1, 1, 1, 0]
    assert chart_counts(page, "#analytics-distribution strong") == [1, 1, 1, 0]
    expect(page.locator("#analytics-skills")).to_contain_text("Python")
    expect(page.locator("#analytics-skills")).to_contain_text("3 candidates")
    expect(page.locator("#analytics-gaps")).to_contain_text("SQL")
    expect(page.locator("#dashboard-active-roles")).to_have_text("1")
    expect(page.locator("#analytics-roles")).to_contain_text("4 candidates")

    # Filtering must not change totals; E: shortlist uses only current IDs.
    page.locator("#candidate-search").fill("Candidate 90")
    expect(page.locator("#candidate-table-body tr")).to_have_count(1)
    assert_totals(page, 3, 80)
    page.locator("#candidate-table-body .table-action").first.click()
    page.locator("#shortlist-button").click()
    assert_totals(page, 3, 80, shortlisted=1)
    page.locator("#shortlist-button").click()
    assert_totals(page, 3, 80)
    page.locator("#shortlist-button").click()
    page.reload()
    assert_totals(page, 3, 80, shortlisted=1)
    expect(page.locator("#recent-analyses-body tr")).to_have_count(2)

    # Real historical buttons reopen their own results and shortlist.
    page.locator("#recent-analyses-body [data-analysis-id]").last.click()
    assert_totals(page, 1, 90)
    page.locator('.nav-item[data-section="dashboard"]').click()
    page.locator("#recent-analyses-body [data-analysis-id]").first.click()
    assert_totals(page, 3, 80, shortlisted=1)

    # F: a new analysis replaces current totals, selection, and shortlist.
    upload(page, ["Candidate 60", "Candidate 40"], "Backend Developer")
    assert_totals(page, 2, 50)
    assert page.evaluate("selectedCandidate") is None
    expect(page.locator("#shortlist-button")).to_be_disabled()
    assert chart_counts(page, "#analytics-distribution strong") == [0, 0, 0, 2]
    expect(page.locator("#dashboard-active-roles")).to_have_text("2")
    expect(page.locator("#recent-analyses-body tr")).to_have_count(3)
    expect(page.locator("#analytics-roles .analytics-bar-row")).to_have_count(2)
    page.reload()
    assert_totals(page, 2, 50)
    assert len(page.evaluate("JSON.parse(localStorage.getItem(resultsStorageKey)).analyses")) == 3
    assert any(stage == "matching" for stage, _ in fake.calls)


def test_verified_skills_missing_skills_and_partial_results(state_page):
    page, _ = state_page
    payload = response_payload([90, 80, 70], ["Verified", "Verified", "Partial"])
    payload["candidates"][0]["matchedSkills"] = ["Python", "Python", " python ", "SQL"]
    payload["candidates"][1]["matchedSkills"] = ["Python", "SQL"]
    payload["candidates"][2]["matchedSkills"] = ["FastAPI", "Python"]
    payload["candidates"][0]["missingSkills"] = ["AWS", "AWS"]
    payload["candidates"][1]["missingSkills"] = ["AWS", "Docker"]
    payload["candidates"][2]["missingSkills"] = ["Docker"]
    # Submitted resumes can exceed successfully analyzed candidates.
    payload.update(status="partial", totalCandidates=4, errors=[
        {"filename": "failed.txt", "stage": "resume", "message": "Resume failed"}
    ])
    deliver_response(page, payload)
    assert_totals(page, 3, 80, verified=2)
    assert chart_counts(page, "#analytics-skills strong") == [3, 2, 1]
    assert page.locator("#analytics-skills .analytics-bar-label > span").all_text_contents() == ["Python", "SQL", "FastAPI"]
    assert chart_counts(page, "#dashboard-skills strong") == [3, 2, 1]
    assert chart_counts(page, "#analytics-gaps strong") == [2, 2]
    expect(page.locator("#analytics-verified-percent")).to_have_text("67%")
    expect(page.locator("#analysis-feedback")).to_contain_text("failed.txt")
    expect(page.locator("#recent-analyses-body")).to_contain_text("Completed with errors")
    page.reload()
    assert_totals(page, 3, 80, verified=2)
    expect(page.locator("#analysis-feedback")).to_contain_text("failed.txt")


@pytest.mark.parametrize("scores,average,distribution", [
    ([90, 80, 70, None, "", "bad", True, "90", 0, -1, 101], 66, [2, 1, 1, 1]),
    ([None, "", "bad", False], 0, []),
    ([100, 90, 89.9, 80, 79.9, 70, 69.9, 0], 72, [2, 2, 2, 2]),
])
def test_missing_and_invalid_scores_are_not_zero_scores(state_page, scores, average, distribution):
    page, _ = state_page
    statuses = (["Partial", "Unavailable", "Not Provided", "Available", "verified"] * 3)[:len(scores)]
    deliver_response(page, response_payload(scores, statuses))
    assert_totals(page, len(scores), average)
    assert chart_counts(page, "#analytics-distribution strong") == distribution
    assert "NaN" not in page.locator("#dashboard").text_content()
    assert "NaN" not in page.locator("#analytics").text_content()
    if not distribution:
        expect(page.locator("#analytics-distribution")).to_have_text("No match scores reported")
        expect(page.locator("#dashboard-distribution-insight")).to_have_text("No match scores reported")
    else:
        assert chart_counts(page, "#dashboard .chart-bar > span") == distribution


def test_sample_is_explicit_and_never_overwrites_persisted_real_history(state_page):
    page, _ = state_page
    upload(page, ["Alice Example"])
    saved = page.evaluate("localStorage.getItem(resultsStorageKey)")
    page.locator('.nav-item[data-section="new-analysis"]').click()
    while page.locator(".uploaded-file .remove-button").count():
        page.locator(".uploaded-file .remove-button").first.click()
    page.locator("#use-sample-data").click()
    page.locator("#run-analysis-button").click()
    expect(page.locator("#candidates")).to_be_visible(timeout=20_000)
    assert_totals(page, 5, 85, verified=3)
    expect(page.locator("#workspace-data-label")).to_have_text("Demo workspace")
    expect(page.locator("#analytics-roles .analytics-bar-row")).to_have_count(1)
    expect(page.locator("#analytics-roles")).to_contain_text("5 candidates")
    page.locator("#candidate-table-body .table-action").first.click()
    page.locator("#shortlist-button").click()
    assert_totals(page, 5, 85, shortlisted=1, verified=3)
    assert page.evaluate("localStorage.getItem(resultsStorageKey)") == saved

    restored = page.context.new_page()
    restored.goto(page.url)
    assert_totals(restored, 1, 91)
    expect(restored.locator("#workspace-data-label")).to_have_text("Recruitment workspace")
    restored.close()

    # A live result replaces sample candidates, charts, role and shortlist.
    upload(page, ["Alice Example", "Bob Example"], "API Engineer")
    assert_totals(page, 2, 82)
    expect(page.locator("#workspace-data-label")).to_have_text("Recruitment workspace")
    expect(page.locator("#analytics-roles")).not_to_contain_text("AI Engineer")
    assert len(page.evaluate("JSON.parse(localStorage.getItem(resultsStorageKey)).analyses")) == 2
    page.reload()
    assert_totals(page, 2, 82)


@pytest.mark.parametrize("storage_mode", ["corrupt", "disabled", "stale_shortlist", "quota"])
def test_storage_failures_and_old_demo_shortlist_do_not_create_fake_results(state_page, storage_mode):
    page, _ = state_page
    if storage_mode == "corrupt":
        page.evaluate("localStorage.setItem(resultsStorageKey, '{broken')")
    elif storage_mode == "stale_shortlist":
        page.evaluate("localStorage.setItem('cognify-shortlisted', '[1,2,3]')")
    else:
        method = "getItem" if storage_mode == "disabled" else "setItem"
        page.add_init_script(f"Storage.prototype.{method} = function () {{ throw new Error('Storage unavailable'); }};")
    page.reload()
    assert_totals(page, 0, 0)
    upload(page, ["Alice Example"])
    assert_totals(page, 1, 91)
    page.locator("#candidate-table-body .table-action").first.click()
    page.locator("#shortlist-button").click()
    assert_totals(page, 1, 91, shortlisted=1)
