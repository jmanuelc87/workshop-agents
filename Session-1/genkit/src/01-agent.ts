import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL_BASE =
  "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&";

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) throw new Error("YOUTUBE_API_KEY environment variable not set");

const ai = genkit({
  plugins: [googleAI()],
});

const outputSearchVideos = z.object({
  title: z.string(),
  summary: z.string(),
  whyVideo: z.string(),
  url: z.string(),
});

const searchYoutubeVideos = ai.defineTool(
  {
    name: "searchYoutubeVideos",
    description:
      "Searches YouTube for videos matching a specific query. Use this tool when the user explicitly asks for videos, visual tutorials, music, or general content consumption on YouTube. Returns a JSON string with video metadata (titles, IDs, snippets).",
    inputSchema: z.object({
      text: z
        .string()
        .describe("The search terms, keywords, or topic to find videos for."),
    }),
    outputSchema: z.string(),
  },
  async ({ text }) => {
    try {
      console.log("Getting videos from youtube...");
      const api = `${API_URL_BASE}q=${text}&key=${API_KEY}`;
      const response = await axios.get<any>(api);
      const videos = JSON.stringify(response.data);
      console.log("List of videos: ", videos);
      return videos;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
);

export const searchSummaryVideosFlow = ai.defineFlow(
  {
    name: "searchSummaryVideosFlow",
    inputSchema: z.object({
      topic: z.string(),
    }),
    outputSchema: outputSearchVideos.nullable(),
  },
  async ({ topic }) => {
    const { output } = await ai.generate({
      prompt: [
        {
          text: `
              ROLE
              You are an expert Content Curator and Video Summarizer AI. 
              Your goal is to find the most valuable video on a given topic and provide a concise, high-quality summary for the user.

              # WORKFLOW
              Follow these steps for every request:

              1.  **ANALYZE & SEARCH**:
                  - Identify the core topic from the user's request.
                  - Generate a specific search query.
                  - Call searchYoutubeVideos.

              2.  **EVALUATE & SELECT**:
                  - Analyze the search results.
                  - Select the "Best Video" based on the <selection_criteria> below.
                  - You must explain your choice in a <thought> block.

              3.  **SUMMARIZE**:
                  - Create a summary of the selected video.
                  - Do not hallucinate content that is not present in the metadata.

              # SELECTION CRITERIA (How to choose the "Best")
              Prioritize videos in this order:
              1.  **Relevance:** The title must match the user's intent perfectly.
              2.  **Information Density:** Prefer videos with detailed descriptions that allow for a good summary.
              3.  **Authority/Popularity:** Prefer videos with higher view counts or from reputable channels.
              4.  **Freshness:** If the topic is news/tech, prefer recent videos.

              # FEW-SHOT EXAMPLE

              User: "I want to learn about Quantum Computing basics."

              Agent:
              <thought>
              I will search for "Quantum Computing basics". I need a video that is introductory and popular.
              </thought>
              Call Tool: searchYoutubeVideos("Quantum Computing basics")

              **🏆 Selected Video:** Quantum Computers Explained (http://youtube...)
              **👀 Views:** 15M
              **💡 Why this video?** It has the highest engagement and covers core concepts like qubits.

              **📝 Summary:**
              * Explains the difference between classical bits and qubits.
              * Introduces the concept of superposition.
              
              topic given by user => ${topic}
          `,
        },
      ],
      model: googleAI.model("gemini-2.5-flash", {
        temperature: 0.8,
      }),
      output: { schema: outputSearchVideos },
      tools: [searchYoutubeVideos],
    });

    return output;
  }
);
