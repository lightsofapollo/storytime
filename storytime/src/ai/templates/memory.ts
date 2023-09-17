import endent from "endent";
import { BaseTemplate } from "./base";

export const MOCK_MEMORY_OUTPUT = endent`
  Memory: Created a beautiful painting (50 days ago)
  Memory: Went to the Robot Workshop (10 days ago)
  Memory: Explored the Dark Forest (5 days ago)
  Memory: Built a robot companion named Sparky (2 days ago)
  Memory: Discovered a hidden cave filled with rare minerals (1 day ago)

  Action: Built a robot army (8)
  Action: Chased squirrels (4)
  Action: Sniffed a new rock (3)
  Action: Barked excitedly at a new invention (7)
  Action: Got distracted by a passing robot (5)
  `;

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


        Include 5 memories and 5 actions

        ${summary}`;
  }
}
