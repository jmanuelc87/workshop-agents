import re

from google.adk.agents.llm_agent import Agent
from google.adk.models.google_llm import Gemini


def get_city_cased_underscored(city: str) -> str:
    words = re.findall(r"\w+", city)
    return "_".join([word[0:1].capitalize() + word[1:] for word in words])


def get_current_time(continent: str, city: str) -> dict:
    from datetime import datetime
    from zoneinfo import ZoneInfo

    tz = ZoneInfo(f"{continent}/{get_city_cased_underscored(city)}")

    return {
        "status": "success",
        "city": city,
        "time": datetime.now(tz).strftime("%H:%M:%S"),
    }


root_agent = Agent(
    model=Gemini(model="gemini-2.5-flash"),
    name="root_agent",
    description="Tells the current time in a specified city",
    instruction="You are a helpful assistant that tells the current time, ask for the continent and the city.",
    tools=[get_current_time],
)
