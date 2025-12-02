import os

import google.cloud.logging
from dotenv import load_dotenv
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset

from .prompts.load_prompts import load_agent_config
from .tools.availability_check_tools import check_availability_coffee
from .tools.common_tools import get_today_date

client = google.cloud.logging.Client()
client.setup_logging()

load_dotenv()

LLM_AGENT = os.getenv("LLM_AGENT")
if not LLM_AGENT:
    raise ValueError("The LLM_AGENT environment variable is not set.")

MCP_MENU_SERVER_URL = os.getenv("MCP_MENU_SERVER_URL")
if not MCP_MENU_SERVER_URL:
    raise ValueError(
        "The MCP_MENU_SERVER_URL environment variable is not set.")

agent_config = load_agent_config()

print(agent_config)


head_barista_agent = LlmAgent(
    name="head_barista_agent",
    model=LLM_AGENT,
    description=agent_config["description"],
    instruction=agent_config["instruction"],
    tools=[
        check_availability_coffee,
        get_today_date,
        MCPToolset(
            connection_params=StreamableHTTPServerParams(
                url=MCP_MENU_SERVER_URL,
            ),
        ),
    ],
)
