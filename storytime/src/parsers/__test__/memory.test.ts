import endent from "endent";
import { parseMemoryOutput } from "../memory";

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

    console.log(parseMemoryOutput("1", memories));
    const output = parseMemoryOutput("1", memories);
    expect(output).toEqual({
      recalls: [
        {
          storyMetadataId: "1",
          text: "Created a beautiful painting",
          timeAgo: "50 days ago",
        },
        {
          storyMetadataId: "1",
          text: "Went to the Robot Workshop",
          timeAgo: "10 days ago",
        },
        {
          storyMetadataId: "1",
          text: "Explored the Dark Forest",
          timeAgo: "5 days ago",
        },
        {
          storyMetadataId: "1",
          text: "Built a robot companion named Sparky",
          timeAgo: "2 days ago",
        },
        {
          storyMetadataId: "1",
          text: "Discovered a hidden cave filled with rare minerals",
          timeAgo: "1 day ago",
        },
      ],
      actions: [
        { storyMetadataId: "1", text: "Built a robot army", importance: 8 },
        { storyMetadataId: "1", text: "Chased squirrels", importance: 4 },
        { storyMetadataId: "1", text: "Sniffed a new rock", importance: 3 },
        {
          storyMetadataId: "1",
          text: "Barked excitedly at a new invention",
          importance: 7,
        },
        {
          storyMetadataId: "1",
          text: "Got distracted by a passing robot",
          importance: 5,
        },
      ],
    });
  });
});
