import datetime
from enum import Enum
import re

REGEXP = r"(Memory|Action)\s*:(.*)(\(.*\))"
NUMBER_REGEXP = r"(\d)+"


class MemoryType(Enum):
    MEMORY = "memory"
    ACTION = "action"


class MemoryActionRecall:
    level: int
    action: str

    def __init__(self, action, level):
        self.action = action
        self.level = level

    def __str__(self):
        return f"Action: {self.action} ({self.level})"


class MemoryRecall:
    time_ago: str
    memory: str

    def __init__(self, memory, days_ago):
        self.memory = memory
        self.days_ago = days_ago

    def __str__(self):
        return f"Memory: {self.memory} ({self.days_ago})"


def parse_into_memory(input: str) -> list[MemoryRecall | MemoryActionRecall]:
    """Parses the input and returns a list of MemoryRecall objects"""
    memory_list = []
    for line in input.splitlines():
        match = re.match(REGEXP, line, re.IGNORECASE)
        if match:
            memory_type = match.group(1).lower()
            memory = match.group(2).strip()
            importance = match.group(3).replace(
                "(", "").replace(")", "").strip()
            if memory_type == MemoryType.MEMORY.value:
                memory_list.append(MemoryRecall(memory, importance))
            elif memory_type == MemoryType.ACTION.value:
                importance_as_number = re.match(
                    NUMBER_REGEXP, importance, re.IGNORECASE)
                if importance_as_number:
                    importance = int(importance_as_number.group(0))
                    memory_list.append(MemoryActionRecall(memory, importance))
                else:
                    memory_list.append(MemoryActionRecall(memory, 0))

    return memory_list
