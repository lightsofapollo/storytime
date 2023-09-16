const REGEXP = /(Memory|Action)\s*:(.*)(\(.*\))/;

function rawParse(memory: string) {
  const memories = memory.split("\n").filter((memory) => memory.length > 0);

  const parsedMemories: {
    type: string;
    description: string;
    importance: string;
  }[] = [];

  for (const memory of memories) {
    const match = memory.match(REGEXP);
    if (!match) continue;

    const [, type, description, importance] = match;
    parsedMemories.push({
      type: type.trim().toLowerCase(),
      description: description.trim(),
      importance: importance.trim().replace("(", "").replace(")", ""),
    });
  }
  return parsedMemories;
}

export type RecallMemory = {
  type: "recall";
  text: string;
  timeAgo: string;
};

export type ActionMemory = {
  type: "action";
  text: string;
  importance: number;
};

export function parseMemoryOutput(
  input: string
): (RecallMemory | ActionMemory)[] {
  return rawParse(input).map((memory) => {
    if (memory.type == "action") {
      return {
        type: "action",
        text: memory.description,
        importance: parseInt(memory.importance, 10),
      } as ActionMemory;
    }
    return {
      type: "recall",
      text: memory.description,
      timeAgo: memory.importance,
    } as RecallMemory;
  });
}
