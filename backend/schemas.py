from pydantic import BaseModel


class StoryMetadataBase(BaseModel):
    name: str
    character_sheet: str
    summary: str


class MemoryBase(BaseModel):
    memory_type: str
    memory: str
    relevance: str


class StoryBase(BaseModel):
    name: str
    story: str


class StoryMetadataCreate(StoryMetadataBase):
    pass


class Memory(MemoryBase):
    id: int
    story_metadata_id: int

    class Config:
        orm_mode = True


class Story(StoryBase):
    id: int
    story_metadata_id: int

    class Config:
        orm_mode = True


class StoryMetadata(StoryMetadataBase):
    id: int
    memories: list[Memory] = []

    class Config:
        orm_mode = True
