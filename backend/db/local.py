import os
from pathlib import Path
from db.abstract import AbstractStoryDatabase

from constants import CHARACTER_SHEET_FILE, INITIAL_STORY_FILE, MEMORY_FILE, SUMMARY_FILE
from parsers.memory import ActionMemory, RecallMemory, parse_into_memory


class StoryDatabase(AbstractStoryDatabase):
    root: Path

    def __init__(self, root: Path):
        self.root = root

    def get_initial_story(self) -> str:
        path = self.root.joinpath("data").joinpath(INITIAL_STORY_FILE)
        with open(path) as f:
            return f.read()

    def get_memory(self):
        path = self.root.joinpath("data").joinpath(MEMORY_FILE)
        with open(path) as f:
            memory_raw = f.read()
            return parse_into_memory(memory_raw)

    def get_character_sheet(self) -> str:
        path = self.root.joinpath("data").joinpath(CHARACTER_SHEET_FILE)
        with open(path) as f:
            return f.read()

    def get_summary(self) -> str:
        path = self.root.joinpath("data").joinpath(SUMMARY_FILE)
        with open(path) as f:
            return f.read()

    def latest_story_name(self):
        story_files = self.root.joinpath("stories").glob("*.md")
        return sorted(story_files)[-1]
    
    def next_story_filename(self):
        return self.root.joinpath("stories").joinpath(f"{int(self.latest_story_name().name[:-3]) + 1}.md")
    
    def latest_story(self):
        with open(self.latest_story_name()) as f:
            return f.read()

    def save_new_story(self, story: str):
        with open(self.next_story_filename(), "w") as f:
            f.write(story)

    def add_new_memories(self, memories: list[RecallMemory | ActionMemory]):
        path = self.root.joinpath("data").joinpath(MEMORY_FILE)
        with open(path, "a") as f:
            for memory in memories:
                f.write(str(memory) + "\n")
