import endent from "endent";
import { LLMs } from "../llms";
import { SizedTokenBuilder } from "../sized/SizedTokenBuilder";

const PREAMBLE_TPL = endent`
    Using the following character sheet and previous chapter story tell a rich story full of dialog about the character. The story should be engaging and create a continuing plot line with new events.
    The story should continue where the previous story left off as a chaper book without giving away the ending. The story should not repeat. The story should be a 5-8 paragraphs long.
    The chapter should follow along with the given guidance:
    `;

const POSTAMBLE_TPL = endent`
    The output should be in the form of a single chapter in the following format:
    Do not include memories and actions in the output.
    Do not include choices for continuing the story in the output.

    The full story text continuing off from where the <previous story> left off.
    Does not include Memories or Actions from the prompt only the continuation of the story
    The story should be short and concise. The story should be a single chapter in the following format:

    Title: Name of the story

    100 words worth of story and dialog go here.
    `;

export class StoryBuilder {
  builder: SizedTokenBuilder;
  storyMetadataId: string;
  choice: string;

  constructor(llms: LLMs, storyMetadataId: string, choice: string) {
    this.storyMetadataId = storyMetadataId;
    const { tokenizer, tokenLimit } = llms.tellNextStory({ storyMetadataId });
    this.choice = choice;
    this.builder = new SizedTokenBuilder(tokenizer, tokenLimit);
    this.builder.append(PREAMBLE_TPL);
    this.builder.append(`"${choice}"`);
  }

  appendSheet(sheet: string) {
    return this.builder.append(
      `<character sheet>\n${sheet}\n</character sheet>\n`
    );
  }

  appendPreviousStory(story: string) {
    return this.builder.append(
      `<previous story>\n${story}\n</previous story>\n`
    );
  }

  appendWriterBrief(brief: string) {
    return this.builder.append(
      endent`
        Take guidance from <writer brief> for writing the story itself. Do not explain how it was used in the story.

        <writer brief>\n${brief}\n</writer brief>\n
      `
    );
  }

  appendMemories(memories: string[]) {
    // reserve 70% of the remainder for memories...
    let budget = this.builder.remainder() * 0.7;
    this.builder.append(
      "Use recent <memory> for telling the story but do not include <memory> in the output <memory>\n"
    );

    for (const memory of memories) {
      const measurement = this.builder.measure(memory);
      if (budget - measurement > 0) {
        this.builder.append(`${memory}\n`);
        budget -= measurement;
      }
    }
    this.builder.append("</memory>\n");
  }

  finalize() {
    this.builder.append(`The chapter should resolve "${this.choice}"\n`);
    this.builder.append(POSTAMBLE_TPL);
    return this.builder.output();
  }
}
