from langchain import LLMChain, PromptTemplate
from constants import DEFAULT_TEMPATURE, MAX_NEW_TOKENS
from langchain.chat_models import ChatOpenAI
from langchain.llms import Replicate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler
from parsers.memory import MemoryActionRecall, MemoryRecall, flatten_memory, parse_into_memory

from templates import GET_ACTION_TEMPLATE, GET_RELEVANT_MEMORIES_TEMPLATE, MEMORY_FILL_TEMPLATE, STORY_TEMPLATE, SUMMARY_TEMPLATE, TELL_FIRST_STORY_TEMPLATE, TELL_NEXT_STORY_TEMPLATE, TITLE_TEMPLATE


STORY_LLM_SYSTEM_PROMPT = """
You are a helpful, respectful and honest chapter book writing assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.
"""

ANALYSIS_LLM = "gpt-3.5-turbo"
STORY_LLM = "replicate/meta/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf"


def create_analysis_llm() -> BaseLLM:
    return ChatOpenAI(model="gpt-3.5-turbo", streaming=True,
                      callbacks=[StreamingStdOutCallbackHandler()],
                      temperature=DEFAULT_TEMPATURE)


def create_story_llm() -> BaseLLM:
    return Replicate(
        streaming=True,
        callbacks=[StreamingStdOutCallbackHandler()],
        model="meta/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf",
        input={"temperature": DEFAULT_TEMPATURE,  "system_prompt": STORY_LLM_SYSTEM_PROMPT, "max_new_tokens": 4000,  "top_p": 1})


def get_title(llm: BaseLLM, sheet: str):
    title_template = PromptTemplate.from_template(TITLE_TEMPLATE)
    title_chain = LLMChain(
        llm=llm, prompt=title_template)
    return title_chain.run(sheet=sheet)


def initialize_story_template(story):
    template = PromptTemplate.from_template(STORY_TEMPLATE)
    return template.format(story=story)


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


def tell_a_story(llm: BaseLLM, prompt: str, sheet: str, memories: list[MemoryRecall | MemoryActionRecall]):
    story_template = PromptTemplate.from_template(TELL_FIRST_STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_template)
    return story_chain.run(prompt=prompt, sheet=sheet, memory=flatten_memory(memories))


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
