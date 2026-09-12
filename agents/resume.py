from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate

from langchain_openai import ChatOpenAI

from pypdf import PdfReader

import os


load_dotenv()


model = ChatOpenAI(
    model="openrouter/free",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL"),
    # Bound API waits and retries when the original chain serves a web request.
    timeout=60,
    max_retries=1
)


def read_resume(file_path):

    reader = PdfReader(file_path)

    resume_text = ""

    for page in reader.pages:

        text = page.extract_text()

        if text:

            resume_text = resume_text + text

    return resume_text


prompt = ChatPromptTemplate.from_messages([

    (
        "system",
        """
You are a Resume Agent.

Your job is to analyze the candidate resume.

Find:

- Name
- Skills
- Education
- Experience
- Projects
- Certifications

Do not add anything that is not present in the resume.
"""
    ),

    (
        "human",
        """
Analyze this resume:

{resume}
"""
    )

])


chain = prompt | model


if __name__ == "__main__":
    # Run the original demo only when this file is executed directly.
    resume_path = input("Enter resume path: ")


    resume_text = read_resume(resume_path)


    response = chain.invoke({

        "resume": resume_text

    })


    print(response.content)
