from langchain import PromptTemplate
from litellm import acompletion, completion
from llm import ANALYSIS_LLM, STORY_LLM
from parsers.choices import parse_choices
from parsers.memory import parse_into_memory

from templates import GET_ACTION_TEMPLATE, GET_RELEVANT_MEMORIES_TEMPLATE, MEMORY_FILL_TEMPLATE, STORY_TEMPLATE, SUMMARY_TEMPLATE, TELL_FIRST_STORY_TEMPLATE, TELL_NEXT_STORY_TEMPLATE


def wrap_message(message: str):
    return [{"content": message, "role": "user"}]


async def completion_stream(llm: str, prompt: str):
    async for chunk in completion(llm, wrap_message(prompt), stream=True):
        content = chunk['choices'][0]['delta']['content']
        yield content


async def extract_completion(llm: str, prompt: str):
    result = await acompletion(llm, wrap_message(prompt))
    return result['choices'][0]['message']['content']

# TODO: This should also track cost/expenses somehow


class StorySession():

    async def get_character_sheet(self, story_prompt: str):
        init_prompt = PromptTemplate.from_template(
            STORY_TEMPLATE).format(story=story_prompt)

        async for chunk in completion_stream(ANALYSIS_LLM, init_prompt):
            yield chunk

    async def get_story_summary(self, character_sheet: str) -> str:
        summary_prompt = PromptTemplate.from_template(
            SUMMARY_TEMPLATE).format(sheet=character_sheet)

        async for chunk in completion_stream(ANALYSIS_LLM, summary_prompt):
            yield chunk

    async def get_story_memories(self, summary: str):
        memories_prompt = PromptTemplate.from_template(
            MEMORY_FILL_TEMPLATE).format(summary=summary)

        memories_str = await extract_completion(ANALYSIS_LLM, memories_prompt)
        return parse_into_memory(memories_str)

    async def tell_first_story(self, sheet: str, memory: str, story_prompt: str):
        story_prompt = PromptTemplate.from_template(
            TELL_FIRST_STORY_TEMPLATE).format(sheet=sheet, memory=memory, prompt=story_prompt)

        async for chunk in completion_stream(STORY_LLM, story_prompt):
            yield chunk

    async def tell_next_story(self, sheet: str, memory: str, previous_story: str, choice: str):
        story_prompt = PromptTemplate.from_template(
            TELL_NEXT_STORY_TEMPLATE).format(sheet=sheet, memory=memory, story=previous_story, choice=choice)

        async for chunk in completion_stream(STORY_LLM, story_prompt):
            yield chunk

    async def get_story_choices(self, story: str):
        story_prompt = PromptTemplate.from_template(
            GET_ACTION_TEMPLATE).format(story=story)
        choices_str = await extract_completion(ANALYSIS_LLM, story_prompt)
        return parse_choices(choices_str)

    async def get_relevant_memories(self, state: str, memories: str):
        story_prompt = PromptTemplate.from_template(
            GET_RELEVANT_MEMORIES_TEMPLATE).format(state=state, memories=memories)
        memories_str = await extract_completion(ANALYSIS_LLM, story_prompt)
        return parse_into_memory(memories_str)
