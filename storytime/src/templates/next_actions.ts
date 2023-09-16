import endent from "endent";
import { BaseTemplate } from "./base";

export default class NextActionsTemplate extends BaseTemplate {
  constructor(story: string) {
    super();

    this.template = endent`
        Given the following <story> provide three possible actions that could happen next in the story.  Do not reveal the endings only the beginnings of each action.
        <story>${story}</story>`;
  }
}
