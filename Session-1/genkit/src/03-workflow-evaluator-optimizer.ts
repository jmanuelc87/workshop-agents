import { genkit, z } from "genkit";
import {
  googleAI,
  gemini20Flash,
  gemini20FlashLite,
} from "@genkit-ai/googleai";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const Feedback = z.object({
  accuracy: z.string(),
  fluency: z.string(),
  grammaticalCorrectness: z.string(),
  overallImpression: z.string().describe("Good or Bad"),
});

export const translation = ai.defineFlow(
  {
    name: "translationflow",
    inputSchema: z.object({
      text: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ text }) => {
    let finalTranslation: string | undefined = "";
    let resultEvaluation: string | undefined = "Bad";

    const prompt_translation = `Translate the following text to English: ${text}`;
    let currentPrompt = prompt_translation;

    while (resultEvaluation === "Bad") {
      console.log("Current Prompt:", currentPrompt);

      const { output: translation } = await ai.generate({
        prompt: currentPrompt,
        model: gemini20FlashLite,
        output: { schema: z.object({ translation: z.string() }) },
        system: "You are an expert translator. Spanish to English. ",
      });

      console.log("Translation:", translation?.translation);

      const { output: feedbackLLM } = await ai.generate({
        prompt: `Evaluate the following English translation: ${translation?.translation} of this Spanish text ${text}
                Criteria:
                - **accuracy**
                - **fluency**
                - **grammatical correctness**. 
                - Overall Impression: Based on your assessment, would you rate this translation as Good or Bad`,
        system:
          "You are an expert translator. English to Spanish. You are native Spanish.",
        model: googleAI.model("gemini-2.5-flash", {
          temperature: 0.0,
        }),
        output: { schema: Feedback },
      });

      resultEvaluation = feedbackLLM?.overallImpression;

      console.log("Accuracy:", feedbackLLM?.accuracy);
      console.log("Fluency:", feedbackLLM?.fluency);
      console.log(
        "Grammatical Correctness:",
        feedbackLLM?.grammaticalCorrectness
      );
      console.log("Overall Impression:", resultEvaluation);

      currentPrompt = `With these comments
        - accuracy => ${feedbackLLM?.accuracy}
        - fluency => ${feedbackLLM?.fluency}
        - grammatical correctness => ${feedbackLLM?.grammaticalCorrectness}
        
        Translate again the following text to English:${text}
        Translation:`;

      finalTranslation = translation?.translation ?? "";
    }

    return finalTranslation;
  }
);

// examples:
// ¿Lo decías en serio, o lo decías por decirlo?
// ¿A quién le estás escribiendo esa carta? No es asunto tuyo
// Es en los momentos de decisión cuando se forja nuestro destino.
// La inquebrantable voluntad de emprender, a pesar de los obstáculos que la burocracia interpone continuamente, es el motor que impulsa a quienes aspiran a transformar el panorama económico a largo plazo.
