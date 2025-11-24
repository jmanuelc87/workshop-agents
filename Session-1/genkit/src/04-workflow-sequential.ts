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
  model: googleAI.model("gemini-2.5-flash", {
    temperature: 0.8,
  }),
});

const outputSearchVideos = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

const outputBlog = z.object({
  title: z.string(),
  introduction: z.string(),
  body: z.string(),
  conclusions: z.string(),
  youtubeVideos: outputSearchVideos.array(),
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
      const api = `${API_URL_BASE}q=${text}&key=${API_KEY}`;
      const response = await axios.get<any>(api);
      return JSON.stringify(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
);

export const searchVideosFlow = ai.defineFlow(
  {
    name: "searchVideosFlow",
    inputSchema: z.object({
      text: z.string(),
    }),
    outputSchema: outputBlog.nullable(),
  },
  async ({ text }) => {
    const searchVideoPrompt = await ai.prompt("search_videos");
    const outputSearchVideo = await searchVideoPrompt(
      {
        text,
      },
      {
        output: { schema: outputSearchVideos.array().nullable() },
        tools: [searchYoutubeVideos],
      }
    );

    const recommendedVideos = outputSearchVideo.output;

    const { output } = await ai.generate({
      prompt: `Create an article related to this topic: ${text} with title, introduction, body, conclusions and youtube videos: ${recommendedVideos}}`,
      model: googleAI.model("gemini-2.5-flash", {
        temperature: 0.8,
      }),
      output: {
        schema: outputBlog,
      },
    });

    if (!output) throw new Error("No output");

    return output;
  }
);
