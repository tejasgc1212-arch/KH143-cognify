"""Small adapters for the JSON and Markdown returned by the original agents."""

import json
import math
import re
import unicodedata
from typing import Any


class AgentOutputError(ValueError):
    """An agent returned no usable result, or no valid matching score."""


def key_name(value: str) -> str:
    """Accept snake_case, camelCase, and the agents' human-readable headings."""
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", value)
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def field(data: dict, *names: str, default: Any = None) -> Any:
    lookup = {key_name(str(key)): value for key, value in data.items()}
    for name in names:
        value = lookup.get(key_name(name))
        if value is not None and value != "":
            return value
    return default


def text_value(value: Any, default: str = "Not Mentioned") -> str:
    if value is None or value == "" or value == [] or value == {}:
        return default
    if isinstance(value, dict):
        return "; ".join(f"{key}: {text_value(item)}" for key, item in value.items())
    if isinstance(value, list):
        return "\n".join(text_value(item) for item in value)
    return str(value).strip()


def string_list(value: Any) -> list[str]:
    if value is None:
        return []
    items = value if isinstance(value, list) else re.split(r"\n|,|;", text_value(value, ""))
    result = []
    for item in items:
        item = re.sub(r"^\s*(?:[-*•]|\d+[.)])\s*", "", text_value(item, "")).strip()
        if item and item.casefold().rstrip(".") not in {"none", "n/a", "not mentioned", "not provided", "none identified"}:
            if item not in result:
                result.append(item)
    return result


# These are the headings already requested by the six prompts. Keeping their
# original prose is useful when the model varies its formatting slightly.
HEADINGS = {
    key_name(name) for name in (
        "Job Role", "Required Skills", "Preferred Skills", "Required Experience",
        "Minimum Experience", "Education Requirements", "Responsibilities",
        "Tools and Technologies", "Important Keywords", "Name", "Candidate Name",
        "Skills", "Education", "Experience", "Projects", "Certifications",
        "Project purpose", "Programming languages", "Technologies used",
        "Technical complexity", "Project quality", "Documentation quality",
        "Candidate skills demonstrated", "Strengths", "Weaknesses", "Project Score",
        "Candidate Match Score", "Match Score", "Overall Match Score", "Total Score",
        "GitHub Evidence", "Additional Skills", "Matched Skills", "Verified by GitHub",
        "Resume Only Skills", "Missing Skills", "Final Recommendation", "Reason",
        "Critical Skill Gaps", "Partial Skill Gaps", "Experience Gap", "Education Gap",
        "Unverified Resume Skills", "Recommended Improvements", "Overall Gap Level",
        "Candidate", "Strongest Skills", "GitHub Verified", "Key Strengths",
        "Important Gaps", "Recruiter Summary", "Main Concerns", "Relevant Experience",
    )
}


def normalize_agent_output(output: Any) -> dict:
    """Convert dicts, AIMessage.content, fenced JSON, or labeled prose safely.

    Plain prose is retained as raw_text. Malformed JSON is never executed and
    never silently turned into a made-up score. No eval or Python execution.
    """
    for _ in range(4):
        if isinstance(output, dict):
            return output.copy()
        if hasattr(output, "content"):
            output = output.content
            continue
        if isinstance(output, list):
            # LangChain can return a list of text content blocks.
            if all(isinstance(block, dict) and isinstance(block.get("text"), str) for block in output):
                output = "\n".join(block["text"] for block in output)
                continue
            return {"items": output}
        if not isinstance(output, str) or not output.strip():
            raise AgentOutputError("The agent returned an empty or unsupported result.")
        output = output.strip()
        if len(output) > 200_000:
            raise AgentOutputError("The agent response was too large.")
        try:
            decoded = json.loads(output)
        except (ValueError, RecursionError):
            decoded = None
        if isinstance(decoded, (dict, list, str)):
            output = decoded
            continue
        # Prefer complete fenced JSON, then an object embedded in prose.
        blocks = re.findall(r"```(?:json)?\s*([\s\S]*?)```", output, re.IGNORECASE)
        for block in blocks:
            try:
                decoded = json.loads(block.strip())
                if isinstance(decoded, dict):
                    return decoded
            except (ValueError, RecursionError):
                pass
        start = output.find("{")
        if start >= 0:
            try:
                decoded, _ = json.JSONDecoder().raw_decode(output[start:])
                if isinstance(decoded, dict):
                    return decoded
            except (ValueError, RecursionError):
                pass
        break

    if not isinstance(output, str):
        raise AgentOutputError("The agent returned an unsupported result.")
    result = {"raw_text": output}
    current = None
    for line in output.splitlines():
        clean = re.sub(r"^\s*(?:#{1,6}\s*|[-*•]\s+|\d+[.)]\s+)", "", line).strip()
        clean = clean.replace("**", "").replace("__", "").strip()
        label, separator, value = clean.partition(":")
        key = key_name(label)
        if key in HEADINGS:
            current = key
            result[current] = value.strip() if separator else ""
        elif current and clean and not re.fullmatch(r"[-=_]{3,}", clean):
            result[current] += ("\n" if result[current] else "") + clean
    return result


def score_value(value: Any, maximum: float = 100) -> float | None:
    """Read points, percentages, or XX/max. Do not invent missing scores."""
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, dict):
        value = field(value, "score", "points", "value")
    if isinstance(value, (int, float)):
        score = float(value)
    else:
        match = re.match(r"^\s*(\d+(?:\.\d+)?)\s*(?:/\s*(\d+(?:\.\d+)?)|(%))?(?=\s|$|[.,;(])", str(value))
        if not match:
            return None
        score = float(match[1])
        if match[2]:
            denominator = float(match[2])
            if denominator <= 0:
                return None
            score = score / denominator * maximum
        elif match[3]:
            score = score / 100 * maximum
    return round(score, 2) if math.isfinite(score) and 0 <= score <= maximum else None


def years_value(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value) if math.isfinite(value) and 0 <= value <= 80 else None
    # Do not infer years from dates or assume that missing experience means zero.
    match = re.search(r"\b(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b", text_value(value, ""), re.IGNORECASE)
    return float(match[1]) if match and float(match[1]) <= 80 else None


def identity(value: str) -> str:
    """Exact, Unicode-aware identity matching; never fuzzy-match applicants."""
    return " ".join(unicodedata.normalize("NFKC", value).casefold().split())
