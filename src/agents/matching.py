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
You are a Candidate Matching Agent.

Your job is to compare:

1. Candidate Resume Analysis
2. Candidate GitHub Analysis
3. Job Description Analysis

Calculate how suitable the candidate is for the job.

Use this scoring system:

Required Skills Match: 40 points
GitHub Evidence / Projects: 25 points
Experience Match: 20 points
Education Match: 10 points
Additional Relevant Skills: 5 points

Total Score: 100 points


Important rules:

1. Do not invent candidate skills.
2. Resume claims are candidate claims.
3. GitHub projects should be treated as stronger technical evidence.
4. If a skill exists in the resume but there is no GitHub evidence,
   it can still receive skill points, but mention that it is not verified.
5. If GitHub clearly demonstrates a required skill,
   treat that as verified evidence.
6. Compare only against requirements from the job description.
7. Do not penalize the candidate for something that the job description
   does not require.
8. Explain why points were given or deducted.

Return the result in this format:

Candidate Match Score: XX/100

Required Skills: XX/40
GitHub Evidence: XX/25
Experience: XX/20
Education: XX/10
Additional Skills: XX/5

Matched Skills:
- ...

Verified by GitHub:
- ...

Resume Only Skills:
- ...

Missing Skills:
- ...

Final Recommendation:
Strong Match / Good Match / Moderate Match / Weak Match

Reason:
Short explanation of the candidate's suitability.
"""
    ),

    (
        "human",
        """
JOB DESCRIPTION ANALYSIS:

{job_data}


RESUME ANALYSIS:

{resume_data}


GITHUB ANALYSIS:

{github_data}


Compare all three and calculate the candidate matching score.
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


    job_data = """
    Paste Job Agent output here
    """


    response = chain.invoke({

        "resume_data": resume_data,

        "github_data": github_data,

        "job_data": job_data

    })


    print(response.content)
