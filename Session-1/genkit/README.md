# Genkit Agents Workshop - Session 1

This repository contains multiple agent implementations demonstrating different patterns and capabilities using Firebase Genkit AI framework with Google AI models.

## 📁 Agents Overview

### 1. YouTube Video Curator Agent (`01-agent.ts`)

**Pattern:** Single Agent with Custom Tool

An intelligent agent that searches YouTube, evaluates videos, and provides curated recommendations with summaries.

**What it does:**
- **Custom Tool:** `searchYoutubeVideos` - Searches YouTube API for videos matching a query
- **Agent Workflow:**
  1. Analyzes user's topic request
  2. Generates optimized search query
  3. Calls YouTube API via custom tool
  4. Evaluates results based on relevance, information density, authority, and freshness
  5. Selects the best video with reasoning
  6. Provides structured summary

**Use case:** Finding and summarizing the most relevant YouTube video on any topic

**Key features:**
- Structured output with Zod schema validation
- Selection criteria with explicit reasoning (`<thought>` blocks)
- Few-shot prompting examples embedded in instructions
- Tool integration with external API (YouTube Data API v3)
- Temperature control (0.8) for creative selection

**Output Schema:**
```typescript
{
  title: string,
  summary: string,
  whyVideo: string,
  url: string
}
```

---

### 2. Multi-Modal Blog Generator Agent (`02-agent.ts`)

**Pattern:** Single Agent with Multiple Tools

A sophisticated agent that searches videos, transcribes them, generates blog content, and creates accompanying images.

**What it does:**
- **Tool 1:** `searchYoutubeVideos` - Searches YouTube for relevant videos
- **Tool 2:** `getTranscription` - Transcribes video content using Gemini's multimodal capabilities
- **Tool 3:** `createImageBlog` - Generates blog header images using Imagen 3
- **Agent Workflow:**
  1. Searches for relevant YouTube videos
  2. Transcribes selected video(s)
  3. Generates comprehensive blog post with title, content, conclusions, and references
  4. Creates custom image for the blog
  5. Returns structured blog package

**Use case:** Automated blog post creation from YouTube video content with AI-generated imagery

**Key features:**
- Multi-modal processing (video → text → image)
- Multiple AI models (Gemini 2.5 Flash for text, Imagen 3 for images)
- Prompt management via Genkit prompt system (`search_videos_2`)
- File output (saves generated image to `blog-image.png`)
- Integration with both Google AI and Vertex AI plugins

**Output Schema:**
```typescript
{
  videos: Array<{ title, description, url }>,
  blogTitle: string,
  blogContent: string,
  blogConclusions: string,
  blogReferences: string,
  blogImage: string (data URL)
}
```

---

### 3. Self-Evaluating Translation Optimizer (`03-workflow-evaluator-optimizer.ts`)

**Pattern:** Iterative Feedback Loop with Dual Agent System

A translation workflow that continuously improves translations through self-evaluation until quality criteria are met.

**What it does:**
- **Translator Agent:** Translates Spanish text to English
- **Evaluator Agent:** Critically assesses translation quality
- **Iterative Loop:**
  1. Initial translation of Spanish text
  2. Evaluation across multiple criteria (accuracy, fluency, grammar)
  3. If "Bad" → refine prompt with specific feedback and retry
  4. If "Good" → return final translation
  5. Continues until approval

**Use case:** High-quality Spanish-to-English translation with automated quality control

**Key features:**
- Self-optimizing workflow with feedback integration
- Structured evaluation criteria (accuracy, fluency, grammatical correctness)
- Dynamic prompt refinement based on LLM feedback
- Temperature 0.0 for evaluator (deterministic assessment)
- Dual model usage (Flash Lite for translation, Flash for evaluation)
- No max iteration limit (continues until "Good" rating)

**Evaluation Schema:**
```typescript
{
  accuracy: string,
  fluency: string,
  grammaticalCorrectness: string,
  overallImpression: "Good" | "Bad"
}
```

**Workflow:**
```
Spanish Text → Translate → Evaluate Quality
                   ↑              |
                   |         (if Bad)
                   └─── Refine with Feedback
                            |
                       (if Good)
                            ↓
                    Final Translation
```

---

### 4. Sequential Blog Creator with Video Research (`04-workflow-sequential.ts`)

**Pattern:** Sequential Two-Stage Workflow

A workflow that orchestrates video research followed by article generation in a sequential pipeline.

**What it does:**
- **Stage 1: Video Research**
  - Uses prompt template (`search_videos`)
  - Searches YouTube for relevant videos
  - Returns curated list of recommended videos
- **Stage 2: Article Generation**
  - Takes video recommendations from Stage 1
  - Generates complete blog post structure
  - Integrates video references into the article

**Use case:** Creating comprehensive articles with curated video references

**Key features:**
- Sequential workflow with explicit stage separation
- Prompt management via Genkit prompt system
- Data passing between stages
- Structured output with nested schemas
- Global model configuration with temperature control

**Output Schema:**
```typescript
{
  title: string,
  introduction: string,
  body: string,
  conclusions: string,
  youtubeVideos: Array<{
    title: string,
    description: string,
    url: string
  }>
}
```

**Workflow:**
```
Topic → [Stage 1: Video Research] → Videos → [Stage 2: Article Generation] → Blog Post
```

---

## 🚀 Running the Agents

Each agent is defined as a Genkit flow that can be executed:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add YOUTUBE_API_KEY and other required keys

# Run Genkit developer UI
npx genkit start

# Or import and call flows programmatically
import { searchSummaryVideosFlow } from './src/01-agent';
const result = await searchSummaryVideosFlow({ topic: 'AI agents' });
```

## 🔑 Prerequisites

- Node.js 20+
- YouTube Data API v3 key
- Google AI API key (for Gemini models)
- Vertex AI credentials (for agent 02 with Imagen)

## 📚 Key Concepts

### Agent Patterns

1. **Single Agent with Custom Tool:** Simple agent with external API integration
2. **Multi-Tool Agent:** Agent orchestrating multiple specialized tools
3. **Iterative Feedback Loop:** Self-improving workflow with evaluation
4. **Sequential Pipeline:** Multi-stage processing with data flow

### Genkit Features Demonstrated

- **Tool Definition:** `ai.defineTool()` for custom functions
- **Flow Definition:** `ai.defineFlow()` for agent workflows
- **Prompt Management:** `ai.prompt()` for reusable prompts
- **Schema Validation:** Zod schemas for type-safe I/O
- **Multi-modal Processing:** Video, text, and image generation
- **Model Configuration:** Temperature, retry options, model selection

### Tools & APIs

- **YouTube Data API v3:** Video search and metadata
- **Gemini 2.5 Flash:** Text generation and transcription
- **Gemini 2.0 Flash Lite:** Lightweight translation
- **Imagen 3:** Image generation
- **Custom Functions:** Python tools wrapped as Genkit tools

## 📝 Notes

- All agents use structured output with Zod schemas for type safety
- Temperature settings vary by use case (0.0 for evaluation, 0.8 for creative tasks)
- Multi-modal capabilities enable video transcription and image generation
- Prompt engineering includes few-shot examples and explicit reasoning instructions
- Sequential workflows allow for complex multi-stage processing
- Iterative patterns enable self-improvement and quality optimization