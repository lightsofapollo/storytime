

import pytest
from ai.story_session import StorySession


@pytest.mark.slow
@pytest.mark.asyncio
async def test_story_creation():
    session = StorySession()
    sheet_chunks = []

    async for chunk in session.get_character_sheet("A story about a cat named fred"):
        sheet_chunks.append(chunk)

    sheet = "".join(sheet_chunks)
    assert (sheet.index("Fred") != -1 or sheet.index("fred") != -1)

    summary_chunks = []

    async for chunk in session.get_story_summary(sheet):
        summary_chunks.append(chunk)

    summary = "".join(summary_chunks)
    async for chunk in session.get_story_memories(summary):
        pass


@pytest.mark.slow
@pytest.mark.asyncio
async def test_story_telling():
    sheet = """A funny character named Fred"""
    memory = """
        Memory: Fred bumped his head (5 days ago)
        Action: Fred went to hospital (5)"""
    story_prompt = "Fred went to the store to buy some milk."

    session = StorySession()

    next_story_result = []

    async for chunk in session.tell_first_story(sheet, memory, story_prompt):
        next_story_result.append(chunk)
    assert len(next_story_result) > 0
