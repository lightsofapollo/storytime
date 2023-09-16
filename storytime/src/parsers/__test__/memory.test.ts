import endent from "endent";
import parseMemoryOutput from "../memory";

describe("memory test", () => {
  it("should parse memory correctly", () => {
    const memories = endent`
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

    console.log(parseMemoryOutput(memories));
  });
});
