import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import { vertexAI, imagen3Fast } from "@genkit-ai/vertexai";
import parseDataURL from "data-urls";
import { writeFile } from "node:fs/promises";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL_BASE =
  "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&";

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) throw new Error("YOUTUBE_API_KEY environment variable not set");

const ai = genkit({
  plugins: [googleAI(), vertexAI()],
});

const outputSearchVideos = z.object({
  videos: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string(),
    })
  ),
  blogTitle: z.string(),
  blogContent: z.string(),
  blogConclusions: z.string(),
  blogReferences: z.string(),
  blogImage: z.string(),
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

const getTranscription = ai.defineTool(
  {
    name: "getTranscription",
    description: "Get transcription from youtube",
    inputSchema: z.object({
      url: z.string(),
    }),
    outputSchema: z.string().nullable(),
  },
  async ({ url }) => {
    console.log("Getting transcription from youtube...");
    const { text } = await ai.generate({
      prompt: [
        {
          text: "transcribe this video",
        },
        {
          media: {
            url: url,
            contentType: "video/mp4",
          },
        },
      ],
      model: googleAI.model("gemini-2.5-flash", {
        temperature: 0.0,
      }),
    });
    console.log("transcription created", text);
    return text;
  }
);

const createImageBlog = ai.defineTool(
  {
    name: "createImageBlog",
    description: "Create an image based on a text",
    inputSchema: z.object({
      text: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ text }) => {
    console.log("Creating image...");
    console.log("prompt: ", text);

    const { media } = await ai.generate({
      model: imagen3Fast,
      prompt: `An illustration for this blog post: ${text}`,
      output: { format: "media" },
    });

    if (media?.url) {
      const parsed = parseDataURL(media.url);
      if (parsed) {
        await writeFile("blog-image.png", parsed.body);
      }
    }
    return media?.url ?? "";
  }
);

export const searchSummaryVideosFlow = ai.defineFlow(
  {
    name: "searchSummaryVideosFlow",
    inputSchema: z.object({
      text: z.string(),
    }),
    outputSchema: outputSearchVideos.nullable(),
  },
  async ({ text }) => {
    const searchVideoPrompt = await ai.prompt("search_videos_2");
    const output = searchVideoPrompt(
      {
        text,
      },
      {
        output: { schema: outputSearchVideos.nullable() },
        tools: [searchYoutubeVideos, getTranscription, createImageBlog],
      }
    );

    return (await output).output;
  }
);
