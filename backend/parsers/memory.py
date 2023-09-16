from enum import Enum
import re

from pydantic import BaseModel

REGEXP = r"(Memory|Action)\s*:(.*)(\(.*\))"
NUMBER_REGEXP = r"(\d)+"


class MemoryType(Enum):
    MEMORY = "memory"
    ACTION = "action"


class ActionMemory(BaseModel):
    type: MemoryType = MemoryType.ACTION
    importance: int
    action: str

    def __str__(self):
        return f"Action: {self.action} ({self.importance})"


class RecallMemory(BaseModel):
    type: MemoryType = MemoryType.MEMORY
    time_ago: str
    memory: str

    def __str__(self):
        return f"Memory: {self.memory} ({self.time_ago})"


def flatten_memory(memory_list: list[RecallMemory | ActionMemory]) -> str:
    return "\n".join([str(memory) for memory in memory_list])


def parse_into_memory(input: str) -> list[RecallMemory | ActionMemory]:
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
                memory_list.append(RecallMemory(
                    memory=memory, time_ago=importance))
            elif memory_type == MemoryType.ACTION.value:
                importance_as_number = re.match(
                    NUMBER_REGEXP, importance, re.IGNORECASE)
                if importance_as_number:
                    importance = int(importance_as_number.group(0))
                    memory_list.append(ActionMemory(
                        action=memory, importance=importance))
                else:
                    memory_list.append(
                        ActionMemory(action=memory, importance=0))

    return memory_list
