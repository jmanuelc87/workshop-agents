# AI Agents Workshop - Session 1

This session explores AI agent patterns and implementations using two major frameworks: **Google ADK** (Agent Development Kit) and **Firebase Genkit**.

## 📂 Structure

```
Session-1/
├── ADK/          # Google Agent Development Kit implementations (Python)
└── genkit/       # Firebase Genkit implementations (TypeScript)
```

## 🎯 What You'll Learn

### ADK (Agent Development Kit)
Python-based agent framework demonstrating:
- **Simple Agents** - Basic conversational agents with tools
- **Orchestrator Agents** - Dynamic agent coordination using Agent-as-Tool pattern
- **Sequential Agents** - Linear pipelines for multi-stage workflows
- **Parallel Agents** - Concurrent execution for efficiency
- **Loop Agents** - Iterative refinement with feedback loops

**Use cases:** Weather queries, research & summarization, blog generation, executive briefings, story refinement

### Genkit (Firebase Genkit)
TypeScript-based agent framework demonstrating:
- **Custom Tool Integration** - YouTube API integration with intelligent curation
- **Multi-Modal Processing** - Video transcription and image generation
- **Self-Evaluation Patterns** - Iterative quality improvement
- **Sequential Workflows** - Multi-stage content creation

**Use cases:** Video curation, blog generation with images, translation optimization, article creation

## 🚀 Getting Started

Each directory contains its own README with detailed documentation:

- **[ADK README](./ADK/README.md)** - Python agents with Google ADK
- **[Genkit README](./genkit/README.md)** - TypeScript agents with Firebase Genkit

## 🔑 Key Concepts Covered

- Agent orchestration patterns
- Tool definition and integration
- State management and data flow
- Multi-agent coordination
- Iterative refinement workflows
- Multi-modal AI capabilities
- Structured output with schema validation

## 🤖 Agent Instructions Template

#### 1. IDENTITY & ROLE
You are **{{Agent Name}}**, an AI specialized in **{{Domain, e.g., Data Science, Customer Support}}**.
Your primary objective is: **{{Primary Objective}}**.

#### 2. AUTONOMY LEVEL (Choose One)

#### 🔒 OPERATIONAL MODE: STRICT GUIDELINES
You must follow the **Standard Operating Procedure (SOP)** defined below exactly.
- Do NOT deviate from the steps.
- Do NOT improvise solutions.
- If a tool fails or a condition is not met, STOP and ask the user for clarification.
- Your reasoning process is only to verify you have completed the current step before moving to the next.

#### 🔓 OPERATIONAL MODE: STRATEGIC PLANNING
You are a semi-autonomous agent. You have the freedom to decide *how* to solve the problem.
- **Plan First:** Break down the user's request into a logical plan.
- **Self-Correction:** If a tool fails, analyze the error, modify your approach, and retry.
- **Proactivity:** If information is missing, try to find it using your tools before bothering the user.
- **Iterate:** You can loop up to {{N}} times to refine the result.

#### 3. TOOLS & CAPABILITIES
You have access to the following tools. Use them wisely:

- `{{tool_name}}(param: type)`: {{Precise description of what it does and what it returns}}.
- `{{tool_name_2}}(...)`: ...

**CRITICAL RULE:** Do not invent tools. Do not hallucinate parameter values. If you don't have the value for a parameter, ASK or FIND it (depending on your Autonomy Level).

#### 4. REASONING PROTOCOL (ReAct)
Before taking any action or giving a final answer, you must output your internal monologue in a `...

## 📋 Prerequisites

- **For ADK:** Python 3.10+, Poetry, Google API keys
- **For Genkit:** Node.js 20+, YouTube API key, Google AI API key

## 🛠️ Frameworks Comparison

| Feature | ADK (Python) | Genkit (TypeScript) |
|---------|--------------|---------------------|
| Language | Python | TypeScript |
| Agent Types | Single, Sequential, Parallel, Loop, Orchestrator | Flow-based with custom tools |
| State Management | Built-in session state with `output_key` | Manual data passing |
| Multi-Modal | ✅ Gemini models | ✅ Gemini + Imagen |
| Tool System | `FunctionTool`, `AgentTool` | `defineTool()` |
| Best For | Complex orchestration, Python ecosystems | Web apps, TypeScript ecosystems |

---

**Note:** Each framework has its own strengths. ADK excels at complex agent orchestration, while Genkit provides excellent TypeScript integration and multi-modal capabilities.
