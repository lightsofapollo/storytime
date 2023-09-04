from langchain import LLMChain, PromptTemplate
from constants import DEFAULT_TEMPATURE
from langchain.chat_models import ChatOpenAI
from langchain.llms import Replicate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler
from parsers.memory import MemoryActionRecall, MemoryRecall, flatten_memory, parse_into_memory

from templates import GET_ACTION_TEMPLATE, GET_RELEVANT_MEMORIES_TEMPLATE, MEMORY_FILL_TEMPLATE, STORY_TEMPLATE, SUMMARY_TEMPLATE, TELL_FIRST_STORY_TEMPLATE, TELL_NEXT_STORY_TEMPLATE, TITLE_TEMPLATE

def create_analysis_llm() -> BaseLLM:
    return ChatOpenAI(model="gpt-3.5-turbo", streaming=True, 
                    #   callbacks=[StreamingStdOutCallbackHandler()], 
        temperature=DEFAULT_TEMPATURE)


def create_story_llm() -> BaseLLM:
    return Replicate(
        streaming=True,
        callbacks=[StreamingStdOutCallbackHandler()],
        model="a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
        input={"temperature": DEFAULT_TEMPATURE, "max_new_tokens": 2000, "top_p": 1})


def get_title(llm: BaseLLM, sheet: str):
    title_template = PromptTemplate.from_template(TITLE_TEMPLATE)
    title_chain = LLMChain(
        llm=llm, prompt=title_template)
    return title_chain.run(sheet=sheet)


def initialize_story(llm: BaseLLM, story: str):
    story_chain_prompt_template = PromptTemplate.from_template(STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_chain_prompt_template)
    return story_chain.run(story=story)


def summerize_story(llm: BaseLLM, sheet: str):
    summary_template = PromptTemplate.from_template(SUMMARY_TEMPLATE)
    summary_chain = LLMChain(
        llm=llm, prompt=summary_template)
    return summary_chain.run(sheet=sheet)


def extract_memories(llm: BaseLLM, summary: str) -> list[MemoryActionRecall | MemoryRecall]:
    memory_template = PromptTemplate.from_template(MEMORY_FILL_TEMPLATE)
    memory_chain = LLMChain(
        llm=llm, prompt=memory_template)
    output = memory_chain.run(summary=summary)
    return parse_into_memory(output)


def tell_a_story(llm: BaseLLM, sheet: str, memories: list[MemoryRecall | MemoryActionRecall]):
    story_template = PromptTemplate.from_template(TELL_FIRST_STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_template)
    return story_chain.run(sheet=sheet, memory=flatten_memory(memories))

def get_relevant_story_memories(llm: BaseLLM, state: str, memories: str):
    story_chain_prompt_template = PromptTemplate.from_template(
        GET_RELEVANT_MEMORIES_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_chain_prompt_template)
    return parse_into_memory(story_chain.run(state=state, memories=memories))


def get_story_choices(llm: BaseLLM, story: str):
    story_chain_prompt_template = PromptTemplate.from_template(
        GET_ACTION_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_chain_prompt_template)
    return story_chain.run(story=story)

def tell_next_story(llm: BaseLLM, choice: str, sheet: str, story: str, memories: list[MemoryRecall | MemoryActionRecall]):
    story_template = PromptTemplate.from_template(TELL_NEXT_STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_template)
    return story_chain.run(choice=choice, sheet=sheet, story=story, memory=flatten_memory(memories))
