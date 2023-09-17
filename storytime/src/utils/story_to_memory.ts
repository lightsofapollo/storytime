import { parseMemoryOutput } from "@/parsers/memory";
import MemoryTemplate from "@/ai/templates/memory";
import { Costs, Session } from "@/ai/session/session";
import { text } from "stream/consumers";

export async function storyToMemory(
  session: Session,
  storyMetadataId: string,
  prompt: string
) {
  let cost: Costs | null = null;
  const template = new MemoryTemplate(prompt);
  const response = await session.createStream({
    messages: [{ content: template }],
    onCompletion(completion, _costs) {
      cost = _costs;
    },
  });

  // drain
  const result = await text(response as any);
  const memories = parseMemoryOutput(storyMetadataId, result || "");
  console.log({ result, cost });
  // cost should be populated by now...
  return { memories, cost };
}
