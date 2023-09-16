from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ai.story_session import StorySession
from parsers.choices import Choice
from parsers.memory import ActionMemory, RecallMemory


router = APIRouter()


class CharacterSheetInput(BaseModel):
    story_prompt: str


class StorySheetInput(BaseModel):
    sheet: str


class InitialStoryMemoryInput(BaseModel):
    summary: str


class MemoryOutput(BaseModel):
    memories: list[RecallMemory | ActionMemory]


class RelevantMemoryInput(BaseModel):
    state: str
    memories: str


class FirstStoryInput(BaseModel):
    sheet: str
    memory: str
    story_prompt: str


class TellNextStoryInput(BaseModel):
    sheet: str
    memory: str
    previous_story: str
    choice: str


class StoryChoiceInput(BaseModel):
    story: str


class StoryChoiceOutput(BaseModel):
    choices: list[Choice]


@router.post("/character_sheet")
async def character_sheet(story_prompt: CharacterSheetInput):
    story_session = StorySession()
    return StreamingResponse(story_session.get_character_sheet(story_prompt.story_prompt))


@router.post("/story_summary")
async def story_summary(input: StorySheetInput):
    story_session = StorySession()
    return StreamingResponse(story_session.get_story_summary(input.sheet))


@router.post("/tell_first_story")
async def tell_first_story(input: FirstStoryInput):
    story_session = StorySession()
    return StreamingResponse(story_session.tell_first_story(input.sheet, input.memory, input.story_prompt))


@router.post("/tell_next_story")
async def tell_next_story(input: TellNextStoryInput):
    story_session = StorySession()
    return StreamingResponse(story_session.tell_next_story(input.sheet, input.memory, input.previous_story, input.choice))


@router.post("/initial_story_memories", response_model=MemoryOutput)
async def story_memories(input: InitialStoryMemoryInput):
    story_session = StorySession()
    memories = await story_session.get_story_memories(input.summary)
    return MemoryOutput(memories=memories)


@router.post("/relevant_memories", response_model=MemoryOutput)
async def relevant_memories(input: RelevantMemoryInput):
    story_session = StorySession()
    memories = await story_session.get_relevant_memories(input.state, input.memories)
    return MemoryOutput(memories=memories)


@router.post("/story_choices", response_model=StoryChoiceOutput)
async def story_choices(input: StoryChoiceInput):
    story_session = StorySession()
    choices = await story_session.get_story_choices(input.story)
    return StoryChoiceOutput(choices=choices)
