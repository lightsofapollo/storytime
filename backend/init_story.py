import os
import dotenv
import sys
from datetime import datetime
from constants import CHARACTER_SHEET_FILE, DEFAULT_TEMPATURE, INITIAL_STORY_FILE, INITIAL_STORY_LENGTH, MEMORY_FILE, SUMMARY_FILE, MemoryStreamType
from llm import create_analysis_llm, create_story_llm, extract_memories, initialize_story, summerize_story, tell_a_story

dotenv.load_dotenv()

if __name__ == "__main__":
    gpt35 = create_analysis_llm()
    replicate = create_story_llm() 
    story = sys.argv[1]
    print("initializing story...")
    character_sheet = initialize_story(gpt35, story)
    story_init_name = f"{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}"
    data_dir = f"local/{story_init_name}/data"
    story_dir = f"local/{story_init_name}/stories"
    os.makedirs(story_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    with open(f"{data_dir}/{CHARACTER_SHEET_FILE}", "w") as f:
        f.write(character_sheet)
    print("creating summary story...")
    summary = summerize_story(gpt35, character_sheet)
    with open(f"{data_dir}/{SUMMARY_FILE}", "w") as f:
        f.write(summary)
    memories = extract_memories(gpt35, summary)

    for memory in memories:
        print("Memory created from summary: ", memory)

    print("telling first story summary story...")
    told_story_one = tell_a_story(
        replicate, story, character_sheet, memories)
    with open(f"{story_dir}/{INITIAL_STORY_FILE}", "w") as f:
        f.write(told_story_one)
    new_memories = extract_memories(gpt35, told_story_one)
    with open(f"{data_dir}/{MEMORY_FILE}", "w") as f:
        for memory in memories:
            f.write(str(memory) + "\n")
        for memory in new_memories:
            f.write(str(memory) + "\n")

    print("Done!")
