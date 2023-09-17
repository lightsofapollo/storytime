import endent from "endent";
import { BaseTemplate } from "./base";

export default class FirstStoryTemplate extends BaseTemplate {
  constructor(sheet: string, memory: string, prompt: string) {
    super();
    this.template = endent`Using the following character sheet tell a rich single chapter story full of dialog about the character. The story should be engaging and create a continuing plot line with new events and memories.
        The story should be a foundation for future chapters and stories.

        <character sheet>
        ${sheet}
        </character sheet>

        Include the most relevant recent memories and actions from the actions below in the story.

        <memory>
        ${memory}
        </memory>

        The story should emphasize the elements from the following text in addition:

        ${prompt}`;
  }
}
