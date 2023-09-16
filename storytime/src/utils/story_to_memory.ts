import { parseMemoryOutput } from "@/parsers/memory";
import MemoryTemplate from "@/templates/memory";
import OpenAI from "openai";

const openai = new OpenAI();

export async function storyToMemory(storyMetadataId: number, prompt: string) {
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
  const memories = parseMemoryOutput(result || "");
  const actions = [];
  const recalls = [];

  for (const memory of memories) {
    const { type, ...rest } = memory;
    if (type === "action") {
      actions.push({ ...rest, storyMetadataId });
    } else {
      recalls.push({ ...rest, storyMetadataId });
    }
  }

  return { actions, recalls };
}
