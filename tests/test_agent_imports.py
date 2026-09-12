"""Load the user's actual modules without invoking a provider or CLI demo."""

import builtins

from langchain_openai import ChatOpenAI
import requests

from backend.orchestrator import ExistingAgents


def test_original_agent_imports_and_input_contracts(monkeypatch):
    # Placeholder credentials only initialize the SDK; requests are forbidden.
    monkeypatch.setenv("OPENROUTER_API_KEY", "unused-test-placeholder")
    monkeypatch.setenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

    def unexpected_call(*args, **kwargs):
        raise AssertionError("Import attempted a CLI prompt or external request")

    monkeypatch.setattr(builtins, "input", unexpected_call)
    monkeypatch.setattr(requests, "get", unexpected_call)
    monkeypatch.setattr(ChatOpenAI, "invoke", unexpected_call)
    agents = ExistingAgents()
    contracts = {
        "job": {"job_description"},
        "resume": {"resume"},
        "github": {"github_data"},
        "matching": {"job_data", "resume_data", "github_data"},
        "skill_gap": {"job_data", "match_data"},
        "summary": {"resume_data", "github_data", "match_data", "skill_gap_data"},
    }
    for stage, keys in contracts.items():
        module = agents.modules[stage]
        assert set(module.prompt.input_variables) == keys
        assert module.model.request_timeout == 60
        # Formatting the original prompt checks its contract without an AI call.
        prompt = module.prompt.invoke({key: "Synthetic integration check" for key in keys})
        assert "Synthetic integration check" in prompt.to_string()
