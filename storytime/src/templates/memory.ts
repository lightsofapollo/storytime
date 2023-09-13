import endent from "endent";
import { BaseTemplate } from "./base";

export default class MemoryTemplate extends BaseTemplate {
  constructor(summary: string) {
    super();
    this.template = endent`
        Given the following character summary step-by-step hypothesize what the most recent memories and actions the character has taken in the story.

        This should take the following form:

        Action: Action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).
        * Breakup (10)
        * Brushing teeth (1)


        Memory:  memory description (Days ago)
        * Created a beautiful painting (50 days ago)
        * Went to store (10 days ago)


        The full list should look like this as an example:

        Memory: memory description (Days ago)
        Memory: second memory description (Days ago)
        Action: Action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).
        Action: second action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).


        Include 5 memories and 5Z

        ${summary}`;
  }
}
