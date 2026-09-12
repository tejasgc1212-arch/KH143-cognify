from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate

from langchain_openai import ChatOpenAI

import os


load_dotenv(dotenv_path=".venv/.env")


model = ChatOpenAI(
    model="openrouter/free",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL"),
    # Bound API waits and retries when the original chain serves a web request.
    timeout=60,
    max_retries=1
)


prompt = ChatPromptTemplate.from_messages([

    (
        "system",
        """
You are a Recruiter Summary Agent.

Your job is to create a short and clear final candidate summary
for a recruiter.

You will receive:

1. Resume Analysis
2. GitHub Analysis
3. Matching Analysis
4. Skill Gap Analysis

Create a summary containing:

- Candidate name
- Overall match score
- Strongest skills
- GitHub-verified skills
- Relevant experience
- Important skill gaps
- Main strengths
- Main concerns
- Final recommendation

Rules:

1. Do not invent information.
2. Use only the information provided by the other agents.
3. Keep the summary concise and recruiter-friendly.
4. Mention important evidence from GitHub.
5. Clearly mention any major experience or skill gaps.
6. Do not recalculate the candidate score.
7. Use the score produced by the Matching Agent.

Return the result in this format:

Candidate:
...

Match Score:
.../100

Strongest Skills:
- ...

GitHub Verified:
- ...

Key Strengths:
- ...

Important Gaps:
- ...

Recruiter Summary:
...

Final Recommendation:
Strongly Recommend / Recommend / Consider / Not Recommended
"""
    ),

    (
        "human",
        """
RESUME ANALYSIS:

{resume_data}


GITHUB ANALYSIS:

{github_data}


MATCHING ANALYSIS:

{match_data}


SKILL GAP ANALYSIS:

{skill_gap_data}


Create the final recruiter summary.
"""
    )

])


chain = prompt | model


if __name__ == "__main__":
    # Run the original demo only when this file is executed directly.
    resume_data = """
    Paste Resume Agent output here
    """


    github_data = """
    Paste GitHub Agent output here
    """


    match_data = """
    Paste Matching Agent output here
    """


    skill_gap_data = """
    Paste Skill Gap Agent output here
    """


    response = chain.invoke({

        "resume_data": resume_data,

        "github_data": github_data,

        "match_data": match_data,

        "skill_gap_data": skill_gap_data

    })


    print(response.content)
