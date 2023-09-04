from enum import Enum

DEFAULT_TEMPATURE = 0.7
INITIAL_STORY_LENGTH = 1000
MAX_MEMORIES = 100

CHARACTER_SHEET_FILE = "character_sheet.md"
SUMMARY_FILE = "summary.md"
MEMORY_FILE = "memory.md"
INITIAL_STORY_FILE = "0.md"


class MemoryStreamType(Enum):
    MEMORY = "Memory"
    ACTION = "Action"
