import { parseMemoryOutput } from "@/parsers/memory";
import MemoryTemplate from "@/ai/templates/memory";
import { Costs, BaseSession } from "@/ai/llms/base_session";
import { text } from "stream/consumers";
import { LLMs } from "@/ai/llms";

export async function storyToMemory(
  llms: LLMs,
  storyMetadataId: string,
  prompt: string
) {
  let cost: Costs | null = null;
  const template = new MemoryTemplate(prompt);
  const response = await llms.memories({ storyMetadataId }).createStream({
    messages: [{ content: template }],
    onCompletion(completion, _costs) {
      cost = _costs;
    },
  });

  // drain
  const result = await text(response as any);
  const memories = parseMemoryOutput(storyMetadataId, result || "");
  // cost should be populated by now...
  return { memories, cost };
}
