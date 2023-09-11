from sqlalchemy import Column, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.orm import relationship

from db.database import Base


class MemoryTypes(Enum):
    MEMORY = "memory"
    ACTION = "action"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    foreign_id = Column(String, default=0, required=True, len=255)


class CharacterSheet(Base):
    id = Column(Integer, primary_key=True, index=True)
    story_metata_id = Column(Integer, ForeignKey("story_metadata.id"))
    sheet = Column(Text, default=0, required=True)

    story_metadata = relationship(
        "StoryMetadata", back_populates="character_sheet")


class Summary(Base):
    id = Column(Integer, primary_key=True, index=True)
    story_metata_id = Column(Integer, ForeignKey("story_metadata.id"))
    summary = Column(Text, default=0, required=True)

    story_metadata = relationship("StoryMetadata", back_populates="summary")


class StoryMetadata(Base):
    __tablename__ = "story_metadata"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default=0, required=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    character_sheet = relationship("CharacterSheet")
    summary = relationship("Summary")
    memories = relationship("Memory", back_populates="story_metadata")
    stories = relationship("Story", back_populates="story_metadata")


class Memory(Base):
    __tablename__ = "story_memories"

    id = Column(Integer, primary_key=True, index=True)
    memory_type = Column(Enum(MemoryTypes), default=0)
    memory = Column(Text, required=True)
    relevance: Column(String, required=True)
    story_metadata_id = Column(Integer, ForeignKey("story_metadata.id"))

    story_metadata = relationship("StoryMetadata", back_populates="memories")


class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default=0, required=True)
    story = Column(Text, default=0)

    story_metadata_id = Column(Integer, ForeignKey("story_metadata.id"))

    story_metadata = relationship("StoryMetadata", back_populates="stories")