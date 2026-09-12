"""Real browser-to-FastAPI checks; only external AI/GitHub calls are stubbed."""

from pathlib import Path
import socket
import threading
import time

from playwright.sync_api import expect, sync_playwright
import pytest
import uvicorn

from backend.main import app
from backend import orchestrator
from test_backend import FakeAgents


@pytest.fixture
def live_server(monkeypatch):
    fake = FakeAgents()
    monkeypatch.setattr(orchestrator, "get_agents", lambda: fake)
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    server = uvicorn.Server(uvicorn.Config(app, log_level="critical"))
    thread = threading.Thread(target=server.run, kwargs={"sockets": [sock]}, daemon=True)
    thread.start()
    deadline = time.monotonic() + 10
    while not server.started and time.monotonic() < deadline:
        time.sleep(0.05)
    assert server.started, "Test server did not start"
    try:
        yield f"http://127.0.0.1:{port}/frontend/", fake
    finally:
        server.should_exit = True
        thread.join(timeout=10)
        sock.close()


def test_upload_results_details_and_failure_recovery(live_server):
    url, fake = live_server
    edge = Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe")
    with sync_playwright() as playwright:
        # An installed Edge avoids downloading a separate browser on Windows.
        browser = playwright.chromium.launch(headless=True, executable_path=str(edge) if edge.exists() else None)
        page = browser.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(url)
        page.locator('.nav-item[data-section="new-analysis"]').click()
        page.locator("#job-role").fill("Python Developer")
        page.locator("#minimum-experience").fill("2")
        page.locator("#job-description").fill("Build Python APIs.")
        page.locator("#resume-files").set_input_files([
            {"name": "bob.txt", "mimeType": "text/plain", "buffer": b"Bob Example\nPython"},
            {"name": "alice.txt", "mimeType": "text/plain", "buffer": b"Alice Example\nPython"},
            {"name": "bad.pdf", "mimeType": "application/pdf", "buffer": b"bad PDF"},
        ])
        page.locator(".github-candidate-name").fill("Alice Example")
        page.locator(".github-profile-url").fill("https://github.com/example/project")
        page.locator("#run-analysis-button").click()
        expect(page.locator("#candidates")).to_be_visible()
        expect(page.locator("#candidate-table-body tr")).to_have_count(2)
        expect(page.locator("#candidate-table-body tr").first).to_contain_text("Alice Example")
        expect(page.locator("#analysis-feedback")).to_contain_text("bad.pdf")
        expect(page.locator("#candidate-data-label")).to_have_text("analyzed candidates")
        expect(page.locator("#score-source-label")).to_have_text("Scores from the Matching Agent")

        page.locator("#candidate-search").fill("Bob")
        expect(page.locator("#candidate-table-body tr")).to_have_count(1)
        page.locator("#clear-filters").click()
        page.locator("#candidate-table-body .table-action").first.click()
        expect(page.locator("#detail-name")).to_have_text("Alice Example")
        expect(page.locator("#detail-match")).to_have_text("91% Match")
        for tab in ["resume", "github", "gaps", "summary", "overview"]:
            page.locator("#tab-" + tab).click()
            expect(page.locator("#panel-" + tab)).to_be_visible()
        page.locator("#tab-gaps").click()
        expect(page.locator("#skill-gap-content")).to_contain_text("SQL query optimization")
        expect(page.locator("#skill-gap-content")).not_to_contain_text("Docker Optimization")
        page.locator("#shortlist-button").click()
        expect(page.locator("#shortlist-button")).to_have_attribute("aria-pressed", "true")
        with page.expect_download() as download:
            page.locator("#download-report").click()
        assert download.value.suggested_filename == "Cognify_Alice_Example_Report.txt"
        report = Path(download.value.path()).read_text(encoding="utf-8")
        assert "Overall match: 91%" in report and "No real AI analysis" not in report

        # Provider failure leaves a visible error and unlocks the submit button.
        original = fake.invoke
        def fail(stage, payload):
            raise RuntimeError("private diagnostic must not reach the UI")
        fake.invoke = fail
        page.locator('.nav-item[data-section="new-analysis"]').click()
        page.locator("#run-analysis-button").click()
        expect(page.locator("#progress-value")).to_have_text("Failed")
        expect(page.locator("#progress-message")).to_contain_text("Job Description Agent failed")
        expect(page.locator("#run-analysis-button")).to_be_enabled()
        fake.invoke = original
        page.locator('.nav-item[data-section="new-analysis"]').click()
        page.locator("#run-analysis-button").click()
        expect(page.locator("#candidates")).to_be_visible()
        expect(page.locator("#candidate-table-body tr")).to_have_count(2)

        # Existing sample data and simulated timeline still work separately.
        page.locator('.nav-item[data-section="new-analysis"]').click()
        while page.locator(".uploaded-file .remove-button").count():
            page.locator(".uploaded-file .remove-button").first.click()
        page.locator("#use-sample-data").click()
        page.locator("#run-analysis-button").click()
        expect(page.locator("#candidates")).to_be_visible(timeout=20_000)
        expect(page.locator("#candidate-data-label")).to_have_text("demo candidates")
        expect(page.locator("#candidate-table-body tr")).to_have_count(5)
        assert errors == []
        browser.close()
