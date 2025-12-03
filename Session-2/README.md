# Session-2: Multi-Agent Coffee Shop System

## Overview

A multi-agent AI system for managing a virtual coffee shop built with **Google ADK**, **Gemini**, **Firestore**, and **MCP (Model Context Protocol)**.

## Project Structure

```
Session-2/
├── barista-agent-system/           # Main agent system
│   ├── MCP-Server/                 # FastMCP server (port 9000)
│   └── agents/
│       ├── orchestrator_agent/     # Router agent
│       ├── head_barista_agent/     # Menu expert
│       ├── creative_director_agent/ # Image generation & promos
│       └── market_analyst_agent/   # Trends & data analytics
│
└── pipeline-data-ingestion-menu/   # Menu data pipeline
    ├── src/ingestion_menu.py       # Embedding generation
    └── resources/menu.md           # Coffee menu data
```

## Multi-Agent Architecture

### 1. Orchestrator Agent
Routes user queries to specialized agents:
- Menu questions → Head Barista
- Image requests → Creative Director
- Trend analysis & recommendations → Market Analyst

### 2. Head Barista Agent
Handles menu and availability:
- Semantic search via MCP
- Real-time stock verification
- Time-based availability rules

### 3. Creative Director Agent
Visual experience and marketing:
- Image generation with Imagen 3
- Daily promotions management
- GCS image storage

### 4. Market Analyst Agent
Data-driven insights and recommendations:
- Global trend analysis via BigQuery
- Wikipedia pageview statistics (30-day window)
- MCP Toolbox for Database integration
- Real-time popularity scoring

## Key Components

### MCP Server
- **Port**: 9000
- **Function**: Vector search in Firestore
- **Embeddings**: gemini-embedding-001 (768d)
- **Storage**: Firestore database `embeddings`

### MCP Toolbox for Database
- **Port**: 6000
- **Function**: BigQuery database access for trend analysis
- **Dataset**: bigquery-public-data.wikipedia.pageviews_2025
- **Tools**: SQL queries, table metadata, and custom analytics
- **Configuration**: YAML-based tool definitions in `agents/market_analyst_agent/tools/tools.yaml`

### Data Pipeline
1. **Chunking**: Markdown splitting by headers
2. **Embedding**: Gemini embedding generation
3. **Storage**: Firestore with vector fields
4. **Trigger**: Cloud Storage events or local execution

## Technology Stack

**Core**:
- google-adk ^1.17.0
- google-genai ^1.46.0
- google-cloud-firestore ^2.21.0
- mcp ^1.22.0
- toolbox-core (MCP Toolbox client)

**Pipeline**:
- langchain ^1.0.2
- langchain-text-splitters ^1.0.0
- flask ^3.1.2

## Quick Start

### 1. Ingest Menu Data
```bash
cd pipeline-data-ingestion-menu
python src/ingestion_menu.py
```

### 2. Start MCP Server (Menu Search)
```bash
cd barista-agent-system/MCP-Server
python menu_mcp/server.py
```

### 3. Start MCP Toolbox Server (Market Analytics)
```bash
cd barista-agent-system/agents/market_analyst_agent/tools
./start-mcp-toolbox-server.sh
```

Note: Update the script with your local Toolbox binary path.

### 4. Run Agents
```bash
cd barista-agent-system
poetry run adk web
```

Access the web UI at http://127.0.0.1:8000

## Environment Variables

**Base Configuration** (all agents):
```bash
LLM_AGENT=gemini-1.5-pro-001
MODEL_IMAGEN=image-generation-001
PROJECT_ID=<gcp-project-id>
GCS_BUCKET_NAME=<bucket-name>
```

**Market Analyst Agent** (additional):
```bash
TOOLBOX_URL=http://localhost:6000
```

**Pipeline Only**:
```bash
GOOGLE_API_KEY=<gemini-api-key>
```

## Key Concepts

**RAG Implementation**:
- Vector store: Firestore with cosine similarity
- Embeddings: 768-dimensional vectors
- Retrieval: Top 2 results per query

**MCP Integration**:
- **MCP Server (Menu)**: Semantic search via Firestore vector embeddings
- **MCP Toolbox (Analytics)**: BigQuery access for Wikipedia trend data
- Remote tool access for agents
- Decoupled business logic
- HTTP streamable transport

**ReAct Pattern**:
- Thought → Action → Reflection → Response
- Structured reasoning in prompts

## Code Quality

Pre-commit hooks configured:
- ruff (linter/formatter)
- mypy (type checking)
- reorder-python-imports

See [`.pre-commit-config.yaml`](.pre-commit-config.yaml) for details.

## Documentation

Detailed READMEs are available in each subdirectory:
- [`barista-agent-system/`](barista-agent-system/)
- [`pipeline-data-ingestion-menu/`](pipeline-data-ingestion-menu/)

---

**Author**: jggomez (juan.gomez01@gmail.com)
