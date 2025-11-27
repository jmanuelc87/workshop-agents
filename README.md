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

- **Barista Agent System**: An advanced implementation featuring an orchestrator managing specialized agents (Head Barista, Creative Director) to handle customer interactions, menu queries, and creative tasks.
- **Data Ingestion Pipeline**: A separate pipeline demonstrates how to process and structure external data (`menu.md`) to make it available for the agent system.

**Topics covered:**
- Complex multi-agent collaboration
- System design for specialized agent roles
- Integrating data ingestion pipelines with agent frameworks

## 🚀 Quick Start

Each session contains detailed READMEs with setup instructions and examples.

```bash
cd Session-1/ADK     # Python agents with Google ADK
cd Session-1/genkit  # TypeScript agents with Firebase Genkit
cd Session-2/barista-agent-system # Python multi-agent system
```

## 🎯 Learning Objectives

- Understand different agent orchestration patterns
- Build agents with custom tools and APIs
- Implement multi-agent systems
- Apply feedback loops for quality improvement
- Work with multi-modal AI capabilities

## 📋 Prerequisites

- Python 3.10+ and/or Node.js 20+
- Google AI API keys
- Basic understanding of async programming

---

**Start with [Session 1](./Session-1) to explore agent patterns!**