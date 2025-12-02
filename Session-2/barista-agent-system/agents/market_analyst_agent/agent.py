import os
from toolbox_core import ToolboxSyncClient

import google.cloud.logging
from dotenv import load_dotenv
from google.adk.agents import LlmAgent

from .prompts.load_prompts import load_agent_config

client = google.cloud.logging.Client()
client.setup_logging()

load_dotenv()

LLM_AGENT = os.getenv("LLM_AGENT")
if not LLM_AGENT:
    raise ValueError("The LLM_AGENT environment variable is not set.")

TOOLBOX_URL = os.getenv("TOOLBOX_URL")
if not TOOLBOX_URL:
    raise ValueError("The TOOLBOX_URL environment variable is not set.")

agent_config = load_agent_config()

# MCP Toolbox for Databases
toolbox = ToolboxSyncClient(TOOLBOX_URL)
tools = toolbox.load_toolset('drinks_toolset')

market_analyst_agent = LlmAgent(
    name="market_analyst_agent",
    model=LLM_AGENT,
    description=agent_config["description"],
    instruction=agent_config["instruction"],
    tools=list(tools),
)
