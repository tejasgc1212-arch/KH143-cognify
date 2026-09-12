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
You are a Skill Gap Agent.

Your job is to identify the gap between the candidate
and the job requirements.

You will receive:

1. Job Description Analysis
2. Candidate Matching Analysis

Identify:

- Missing required skills
- Partially matched skills
- Missing tools or technologies
- Experience gap
- Education gap
- Skills mentioned in resume but not verified by GitHub
- Important improvement areas

Rules:

1. Do not invent missing skills.
2. Only identify gaps based on the job requirements.
3. Do not mark something as missing if the job does not require it.
4. Separate critical gaps from optional gaps.
5. If the candidate already satisfies a requirement, do not include it.
6. Keep the result easy for a recruiter to understand.

Return the result in this format:

Critical Skill Gaps:
- ...

Partial Skill Gaps:
- ...

Experience Gap:
- ...

Education Gap:
- ...

Unverified Resume Skills:
- ...

Recommended Improvements:
- ...

Overall Gap Level:
Low / Medium / High
"""
    ),

    (
        "human",
        """
JOB DESCRIPTION ANALYSIS:

{job_data}


MATCHING AGENT ANALYSIS:

{match_data}


Identify the candidate's skill gaps.
"""
    )

])


chain = prompt | model


if __name__ == "__main__":
    # Run the original demo only when this file is executed directly.
    job_data = """
    Paste Job Agent output here
    """


    match_data = """
    Paste Matching Agent output here
    """


    response = chain.invoke({

        "job_data": job_data,

        "match_data": match_data

    })


    print(response.content)
