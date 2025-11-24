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
