# ADK Agents Workshop - Session 1

This repository contains multiple agent implementations demonstrating different patterns and capabilities of the Google ADK (Agent Development Kit).

## 📁 Agents Overview

### 1. First Agent (`first_agent/`)

**Pattern:** Simple Single Agent

A basic conversational agent that demonstrates the fundamentals of the ADK framework.

**What it does:**
- Acts as a helpful assistant that can answer general questions
- Uses Google Search to fetch current information
- Maintains conversation context across multiple queries
- Demonstrates basic agent initialization with retry configuration

**Use case:** Weather queries for multiple cities in a conversational manner

**Key features:**
- Single agent with Google Search tool
- Session state management
- Multi-turn conversation support

---

### 2. Orchestrator Agent (`orchestrator_agent/`)

**Pattern:** Agent-as-Tool

An agent that coordinates other agents by calling them as tools, allowing for dynamic workflow orchestration.

**What it does:**
- **Root Coordinator:** Orchestrates the workflow by deciding which sub-agents to call
- **Research Agent:** Specialized agent that performs web searches and gathers information
- **Summarizer Agent:** Processes research findings and creates concise summaries

**Use case:** Research and summarization of complex topics (e.g., quantum computing advancements)

**Key features:**
- `AgentTool` wrapper to convert agents into callable tools
- Dynamic workflow orchestration by the root agent
- Session state sharing via `output_key` mechanism
- Template-based instruction with state injection (`{research_findings}`)

**Workflow:**
1. Root agent receives user query
2. Calls Research Agent to gather information
3. Calls Summarizer Agent to create a concise summary
4. Returns final summary to user

---

### 3. Sequential Agent (`sequential_agent/`)

**Pattern:** Linear Pipeline

A multi-agent system that executes agents in a predefined sequential order, where each agent builds upon the previous agent's output.

**What it does:**
- **Outline Agent:** Creates a structured blog post outline with headline, sections, and conclusion
- **Writer Agent:** Writes a full blog post (200-300 words) based on the outline
- **Editor Agent:** Polishes the draft by fixing grammar, improving flow, and enhancing clarity

**Use case:** Automated blog post creation with structured workflow

**Key features:**
- `SequentialAgent` ensures agents run in order
- State injection between agents using placeholders (`{blog_outline}`, `{blog_draft}`)
- Each agent stores its output with a unique `output_key`
- Deterministic workflow execution

**Workflow:**
```
User Query → Outline Agent → Writer Agent → Editor Agent → Final Blog Post
```

---

### 4. Parallel Agent (`parallel_agent/`)

**Pattern:** Concurrent Execution + Aggregation

A system that runs multiple agents simultaneously and then aggregates their results.

**What it does:**
- **Tech Researcher:** Researches AI/ML trends, key developments, and impact
- **Health Researcher:** Researches medical breakthroughs and their applications
- **Finance Researcher:** Researches fintech trends and market implications
- **Aggregator Agent:** Combines all research findings into a unified executive summary

**Use case:** Daily executive briefing covering multiple domains

**Key features:**
- `ParallelAgent` runs all sub-agents concurrently for efficiency
- Each researcher stores results independently in session state
- `SequentialAgent` combines parallel execution with sequential aggregation
- Significant performance improvement for independent tasks

**Workflow:**
```
                    ┌─> Tech Researcher ─┐
User Query ─> Parallel ├─> Health Researcher ─┼─> Aggregator Agent ─> Executive Summary
                    └─> Finance Researcher ─┘
```

---

### 5. Loop Agent (`loop_agent/`)

**Pattern:** Iterative Refinement with Exit Condition

An agent system that iteratively refines output based on feedback until a quality threshold is met.

**What it does:**
- **Initial Writer Agent:** Creates the first draft of a short story
- **Critic Agent:** Evaluates the story and provides feedback or approval
- **Refiner Agent:** Either refines the story based on critique OR exits the loop when approved
- **Loop Control:** Continues until approval or max iterations reached

**Use case:** Iterative story writing with quality improvement

**Key features:**
- `LoopAgent` enables iterative execution with exit conditions
- `FunctionTool` (exit_loop) provides explicit loop termination
- State overwriting with same `output_key` for refinement
- Max iterations safety limit to prevent infinite loops
- Conditional logic within agent instructions

**Workflow:**
```
User Query → Initial Writer → ┌─> Critic Agent ──────┐
                              │                        ↓
                              └── Refiner Agent ←─ (feedback/approval)
                                      ↓
                                (if APPROVED: exit_loop)
                                (else: iterate up to max_iterations)
```

---

## 🚀 Running the Agents

Each agent directory contains its own `agent.py` file. To run an agent:

```bash
# Navigate to the specific agent directory
cd agents/<agent_name>

# Run with poetry
poetry run python agent.py
```

## 🔑 Prerequisites

- Python 3.10+
- Poetry for dependency management
- Google API key set in environment variables (`GOOGLE_API_KEY` or `GEMINI_API_KEY`)
- `.env` file configured in each agent directory

## 📚 Key Concepts

### Agent Patterns

1. **Simple Agent:** Single agent with tools
2. **Agent-as-Tool:** Agents calling other agents dynamically
3. **Sequential:** Linear pipeline of agents
4. **Parallel:** Concurrent agent execution
5. **Loop:** Iterative refinement with exit conditions

### State Management

- `output_key`: Stores agent results in session state
- Template injection: Use `{key}` in instructions to inject state values
- State persistence: Maintained across agent executions within a session

### Tools

- `google_search`: Web search capability
- `FunctionTool`: Custom Python functions as tools
- `AgentTool`: Wrap agents to use them as tools

## 🛠️ Common Components

All agents share:
- `commons.py`: Helper functions for runner setup and async agent calls
- Retry configuration for resilience
- Gemini 2.5 Flash models
- Session and state management

## 📝 Notes

- The Parallel Agent had an async generator cleanup issue that was fixed by ensuring all events are consumed before loop termination
- Each pattern demonstrates different use cases and orchestration strategies
- Agents can be composed and nested for complex workflows