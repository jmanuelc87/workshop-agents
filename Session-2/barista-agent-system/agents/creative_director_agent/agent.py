import os

import google.cloud.logging
from dotenv import load_dotenv
from google.adk.agents import LlmAgent

from .prompts.load_prompts import load_agent_config
from .tools.common_tools import get_today_date
from .tools.image_coffee_tools import create_image_coffee
from .tools.promotions_tools import get_current_promotion
from .tools.menu_tools import get_menu_items

client = google.cloud.logging.Client()
client.setup_logging()

load_dotenv()

LLM_AGENT = os.getenv("LLM_AGENT")

if not LLM_AGENT:
    raise ValueError("The LLM_AGENT environment variable is not set.")

agent_config = load_agent_config()

print(agent_config)


creative_director_agent = LlmAgent(
    name="creative_director_agent",
    model=LLM_AGENT,
    description=agent_config["description"],
    instruction=agent_config["instruction"],
    tools=[
        get_today_date,
        get_current_promotion,
        create_image_coffee,
        get_menu_items,
    ],
)
