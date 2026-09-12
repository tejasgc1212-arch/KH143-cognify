from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate

from langchain_openai import ChatOpenAI

import requests

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


def get_github_data(github_link):

    # Example:
    # https://github.com/username/project

    github_link = github_link.replace(".git", "")
    parts = github_link.rstrip("/").split("/")

    owner = parts[-2]
    repo = parts[-1]


    repo_url = f"https://api.github.com/repos/{owner}/{repo}"

    languages_url = f"https://api.github.com/repos/{owner}/{repo}/languages"

    readme_url = f"https://api.github.com/repos/{owner}/{repo}/readme"


    repo_response = requests.get(repo_url, timeout=15)

    languages_response = requests.get(languages_url, timeout=15)

    readme_response = requests.get(
        readme_url,
        headers={
            "Accept": "application/vnd.github.raw+json"
        },
        timeout=15
    )


    if repo_response.status_code != 200:

        return "GitHub repository not found"


    repo_data = repo_response.json()


    if languages_response.status_code == 200:

        languages = languages_response.json()

    else:

        languages = {}


    if readme_response.status_code == 200:

        readme = readme_response.text

    else:

        readme = "README not available"


    github_data = f"""

Repository Name:
{repo_data.get("name")}

Description:
{repo_data.get("description")}

Languages:
{languages}

Stars:
{repo_data.get("stargazers_count")}

Forks:
{repo_data.get("forks_count")}

Open Issues:
{repo_data.get("open_issues_count")}

Created:
{repo_data.get("created_at")}

Last Updated:
{repo_data.get("updated_at")}

README:
{readme}

"""


    return github_data


prompt = ChatPromptTemplate.from_messages([

    (
        "system",
        """
You are a GitHub Analysis Agent.

Your job is to analyze a candidate's GitHub project.

Analyze:

- Project purpose
- Programming languages
- Technologies used
- Technical complexity
- Project quality
- Documentation quality
- Candidate skills demonstrated
- Strengths
- Weaknesses

Do not invent information.

Only use the GitHub information provided.

At the end give:

Project Score: /100
"""
    ),

    (
        "human",
        """
Analyze this GitHub repository:

{github_data}
"""
    )

])


chain = prompt | model


if __name__ == "__main__":
    # Run the original demo only when this file is executed directly.
    github_link = input("Enter GitHub repository link: ")


    github_data = get_github_data(github_link)


    response = chain.invoke({

        "github_data": github_data

    })


    print(response.content)
