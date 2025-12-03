# AI Agents Workshop

A hands-on workshop exploring AI agent patterns and implementations using Google's agent frameworks.

## 📚 Sessions

### [Session 1](./Session-1) - Agent Patterns & Frameworks

Explore fundamental agent patterns using **Google ADK** (Python) and **Firebase Genkit** (TypeScript):

- **ADK Agents**: Simple, Orchestrator, Sequential, Parallel, and Loop patterns
- **Genkit Agents**: Custom tools, multi-modal processing, self-evaluation, and workflows

**Topics covered:**
- Agent orchestration and coordination
- Tool integration (YouTube API, Google Search, image generation)
- State management and data flow
- Iterative refinement and feedback loops
- Multi-modal AI (video, text, images)

### [Session 2](./Session-2) - Multi-Agent Systems & Data Pipelines

This session builds on the fundamentals by constructing a practical, multi-agent system for a virtual coffee shop.

- **Barista Agent System**: An advanced implementation featuring an orchestrator managing specialized agents:
  - **Head Barista**: Menu queries and availability checks via semantic search (MCP Server)
  - **Creative Director**: Image generation with Imagen 3 and promotions management
  - **Market Analyst**: Global trend analysis using BigQuery and Wikipedia pageview data (MCP Toolbox)
- **Data Ingestion Pipeline**: Processes menu data with Gemini embeddings and stores vectors in Firestore for RAG retrieval.

**Topics covered:**
- Complex multi-agent collaboration with role-based delegation
- System design for specialized agent roles
- MCP (Model Context Protocol) integration for remote tools
- MCP Toolbox for database access (BigQuery)
- RAG implementation with Firestore vector search
- Data ingestion pipelines with embeddings
- Real-time trend analysis and data-driven recommendations

## 🚀 Quick Start

Each session contains detailed READMEs with setup instructions and examples.

```bash
cd Session-1/ADK                          # Python agents with Google ADK
cd Session-1/genkit                       # TypeScript agents with Firebase Genkit
cd Session-2/barista-agent-system         # Multi-agent coffee shop system
cd Session-2/pipeline-data-ingestion-menu # Menu data pipeline with embeddings
```

## 🎯 Learning Objectives

- Understand different agent orchestration patterns
- Build agents with custom tools and APIs
- Implement multi-agent systems with role-based specialization
- Apply feedback loops for quality improvement
- Work with multi-modal AI capabilities
- Integrate Model Context Protocol (MCP) for remote tool access
- Build RAG systems with vector embeddings and Firestore
- Connect agents to external data sources (BigQuery, APIs)

## 📋 Prerequisites

- Python 3.10+ and/or Node.js 20+
- Google AI API keys (Gemini)
- Google Cloud Platform account (for Session 2)
  - Firestore database
  - Cloud Storage bucket
  - BigQuery access (public datasets)
- Poetry for Python dependency management
- Basic understanding of async programming

---

**Start with [Session 1](./Session-1) to explore agent patterns!**