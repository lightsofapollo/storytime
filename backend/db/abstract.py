from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import List, Union

from bson import ObjectId
from parsers.memory import MemoryType  # Import other required types
from parsers.memory import ActionMemory, RecallMemory


# Assuming you have classes MemoryRecall and MemoryActionRecall
class AbstractStoryDatabase(ABC):
    @abstractmethod
    def get_initial_story(self) -> str:
        pass

    @abstractmethod
    def get_memory(self):
        pass

    @abstractmethod
    def get_character_sheet(self) -> str:
        pass

    @abstractmethod
    def get_summary(self) -> str:
        pass

    @abstractmethod
    def latest_story_name(self):
        pass

    @abstractmethod
    def latest_story(self):
        pass

    @abstractmethod
    def save_new_story(self, story: str):
        pass

    @abstractmethod
    def add_new_memories(self, memories: List[Union[RecallMemory, ActionMemory]]):
        pass
