import endent from "endent";
import { BaseTemplate } from "./base";

export const MOCK_TELL_NEXT_STORY = endent`
  Good idea here are your list of choices:

  1. Go to the store
  2. Go to the park
  3. Go to the beach`;

export default class TellNextStoryTemplate extends BaseTemplate {
  constructor(sheet: string, story: string, memory: string, choice: string) {
    super();
    this.template = endent`

        Using the following character sheet and previous chapter story tell a rich story full of dialog about the character. The story should be engaging and create a continuing plot line with new events and memories.
        The story should continue where the previous story left off as a chaper book without giving away the ending. The story should not repeat.
        
        The chapter should follow along with the given guidance: "${choice}"
        
        <character sheet>
        ${sheet}
        </character sheet>
        
        <previous story>
        ${story}
        </previous story>
        
        Include the most relevant recent memories and actions from the actions below in the story.
        
        <memory>
        ${memory}
        </memory>
        
        The chapter should resolve ${choice}

        The output should be in the form of a single chapter in the following format:

        Title: Name of the story

        The full story text continuing off from where the <previous story> left off.
        `;
  }
}
