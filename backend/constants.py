from enum import Enum

DEFAULT_TEMPATURE = 0.7
INITIAL_STORY_LENGTH = 1000

CHARACTER_SHEET_FILE = "character_sheet.md"
SUMMARY_FILE = "summary.md"
MEMORY_FILE = "memory.md"
INITIAL_STORY_FILE = "initial_story.md"


class MemoryStreamType(Enum):
    MEMORY = "Memory"
    ACTION = "Action"
