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
  storyMetadataId: string;
  text: string;
  timeAgo: string;
};

export type ActionMemory = {
  storyMetadataId: string;
  text: string;
  importance: number;
};

export function parseMemoryOutput(
  storyMetadataId: string,
  input: string
): {
  recalls: RecallMemory[];
  actions: ActionMemory[];
} {
  const recalls: RecallMemory[] = [];
  const actions: ActionMemory[] = [];
  rawParse(input).forEach((memory) => {
    if (memory.type == "action") {
      const importance = parseInt(memory.importance, 10);
      actions.push({
        storyMetadataId,
        text: memory.description,
        importance: isNaN(importance) ? 0 : importance,
      });
    } else {
      recalls.push({
        storyMetadataId,
        text: memory.description,
        timeAgo: memory.importance,
      });
    }
  });

  return { recalls, actions };
}
