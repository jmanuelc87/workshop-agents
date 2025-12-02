import os

import google.cloud.logging
from dotenv import load_dotenv
from google.adk.agents import LlmAgent

from .prompts.load_prompts import load_agent_config
from google.adk.tools import AgentTool
from head_barista_agent import head_barista_agent
from creative_director_agent import creative_director_agent
from market_analyst_agent import market_analyst_agent
from .tools.common_tools import get_today_date
from .tools.memory_tools import save_user_preference
from .tools.memory_tools import get_user_memories
from .tools.memory_tools import forget_user_memories


client = google.cloud.logging.Client()
client.setup_logging()

load_dotenv()

LLM_AGENT = os.getenv("LLM_AGENT")

if not LLM_AGENT:
    raise ValueError("The LLM_AGENT environment variable is not set.")

agent_config = load_agent_config()

print(agent_config)


root_agent = LlmAgent(
    name="orchestrator_agent",
    model=LLM_AGENT,
    description=agent_config["description"],
    instruction=agent_config["instruction"],
    tools=[
        AgentTool(head_barista_agent),
        AgentTool(creative_director_agent),
        AgentTool(market_analyst_agent),
        get_today_date,
        save_user_preference,
        get_user_memories,
        forget_user_memories,
    ],
)
