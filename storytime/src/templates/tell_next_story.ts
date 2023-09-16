import endent from "endent";
import { BaseTemplate } from "./base";

export default class TellNextStoryTemplate extends BaseTemplate {
  constructor(sheet: string, story: string, memory: string, choice: string) {
    super();
    this.template = endent`

        Using the following character sheet and previous chapter story tell a rich story full of dialog about the character. The story should be engaging and create a continuing plot line with new events and memories.
        The story should continue where the previous story left off as a chaper book without giving away the ending.
        
        The chapter should follow along with the given guidance: "{choice}"
        
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
        
        The chapter should resolve {choice}
        `;
  }
}
