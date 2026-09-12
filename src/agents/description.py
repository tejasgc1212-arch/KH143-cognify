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
You are a Job Description Agent.

Your job is to analyze a job description.

Extract:

- Job Role
- Required Skills
- Preferred Skills
- Required Experience
- Education Requirements
- Responsibilities
- Tools and Technologies
- Important Keywords

Do not invent information.

If something is not mentioned,
write "Not Mentioned".

Return the result clearly.
"""
    ),

    (
        "human",
        """
Analyze this job description:

{job_description}
"""
    )

])


chain = prompt | model


if __name__ == "__main__":
    # Run the original demo only when this file is executed directly.
    job_description = input("Enter Job Description: ")


    response = chain.invoke({

        "job_description": job_description

    })


    print(response.content)
