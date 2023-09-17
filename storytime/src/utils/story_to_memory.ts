import { parseMemoryOutput } from "@/parsers/memory";
import MemoryTemplate from "@/ai/templates/memory";
import OpenAI from "openai";

const openai = new OpenAI();

export async function storyToMemory(storyMetadataId: string, prompt: string) {
  const template = new MemoryTemplate(prompt);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: false,
    messages: [
      {
        role: "user",
        content: template.format(),
      },
    ],
  });
  const result = response.choices[0].message.content;
  return parseMemoryOutput(storyMetadataId, result || "");
}
