/*
 * @jest-environment node
 */

import { LLMs } from "@/ai/llms";
import { randomUUID } from "crypto";
import { StoryBuilder } from "../StoryBuilder";

describe("StoryBuilder", () => {
  it("should allow building story incrementally", () => {
    const llms = new LLMs();
    const choice = "went to the store";
    const storyMetadataId = randomUUID();
    const builder = new StoryBuilder(llms, storyMetadataId, choice);

    const sheet = "This is a character sheet";
    const previousStory = "This is a previous story";
    const memories = ["This is a memory", "This is another memory"];

    builder.appendSheet(sheet);
    builder.appendPreviousStory(previousStory);
    builder.appendMemories(memories);
    const final = builder.finalize();
    expect(final).toContain(sheet);
    expect(final).toContain(previousStory);
    expect(final).toContain(memories[0]);
    expect(final).toContain(memories[1]);
  });

  it("should allow trim memories if needed", () => {
    const llms = new LLMs();
    const choice = "went to the store";
    const storyMetadataId = randomUUID();
    const builder = new StoryBuilder(llms, storyMetadataId, choice);

    const sheet = "This is a character sheet";
    const previousStory = "This is a previous story";

    const memoryCount = 10000;
    const memories = [];
    for (let i = 0; i < memoryCount; i++) {
      memories.push(
        `This is a memory it's very long and consumes a token count that really should be shorter for such a short memory ${i}`
      );
    }

    builder.appendSheet(sheet);
    builder.appendPreviousStory(previousStory);
    builder.appendMemories(memories);
    const final = builder.finalize();
    expect(final).toContain(sheet);
    expect(final).toContain(previousStory);
    expect(final).toContain(memories[0]);
    expect(final).toContain(memories[1]);
    expect(final).toContain(memories[2]);
    expect(final).not.toContain(memories[999]);
    expect(builder.builder.remainder()).toBeGreaterThan(0);
  });
});
