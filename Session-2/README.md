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
│       └── creative_director_agent/ # Image generation & promos
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
- Trend analysis → Market Analyst

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

## Key Components

### MCP Server
- **Port**: 9000
- **Function**: Vector search in Firestore
- **Embeddings**: gemini-embedding-001 (768d)
- **Storage**: Firestore database `embeddings`

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

### 2. Start MCP Server
```bash
cd barista-agent-system/MCP-Server
python menu_mcp/server.py
```

### 3. Run Agents
```python
from orchestrator_agent import root_agent
```

## Environment Variables

```bash
LLM_AGENT=<gemini-model>
MODEL_IMAGEN=<imagen-model>
PROJECT_ID=<gcp-project-id>
GCS_BUCKET_NAME=<bucket-name>
GOOGLE_API_KEY=<api-key>
```

## Key Concepts

**RAG Implementation**:
- Vector store: Firestore with cosine similarity
- Embeddings: 768-dimensional vectors
- Retrieval: Top 2 results per query

**MCP Integration**:
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
