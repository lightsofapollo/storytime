import endent from "endent";
import { BaseTemplate } from "./base";

export default class FirstStoryTemplate extends BaseTemplate {
  constructor(
    sheet: string,
    writerBrief: string,
    memory: string,
    prompt: string
  ) {
    super();

    const brief = !writerBrief
      ? ""
      : endent`
          Take guidance from <writer brief> for writing the story itself. Do not explain how it was used in the story.
          <writer brief>\n${writerBrief}\n</writer brief>
        `;

    this.template = endent`Using the following character sheet tell a rich single chapter story full of dialog about the character. The story should be engaging and create a continuing plot line with new events and memories.
        The story should be a foundation for future chapters and stories. Do not explain elements of the story or add postscript to the story.

        <character sheet>
        ${sheet}
        </character sheet>
        ${brief}

        Include the most relevant recent memories and actions from the actions below in the story.

        <memory>
        ${memory}
        </memory>

        The story should emphasize the elements from the following text in addition:

        ${prompt}
        
        The story should be short and concise. The story should be a single chapter in the following format:

        Title: Name of the story

        100 words worth of story and dialog go here
        `;
  }
}
