import dotenv
import sys
from langchain.chat_models import ChatOpenAI
from langchain.output_parsers import ListOutputParser
from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler
from datetime import datetime
from constants import DEFAULT_TEMPATURE, MemoryStreamType

from templates import MEMORY_FILL_TEMPLATE, STORY_TEMPLATE, SUMMARY_TEMPLATE, TELL_A_STORY_TEMPLATE

dotenv.load_dotenv()


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


def extract_initial_memories(llm: BaseLLM, summary: str):
    memory_template = PromptTemplate.from_template(MEMORY_FILL_TEMPLATE)
    memory_chain = LLMChain(
        llm=llm, prompt=memory_template)
    output = memory_chain.run(summary=summary)
    return output

    output.split("\n")
    memories = []
    for line in output:
        if line.startswith("Memory:"):
            memories.append(
                (MemoryStreamType.MEMORY, line.replace("Memory: ", "")))
        elif line.startswith("Action:"):
            memories.append(
                (MemoryStreamType.ACTION, line.replace("Action: ", "")))

    return memories


def tell_a_story(llm: BaseLLM, sheet: str, memories: str):
    story_template = PromptTemplate.from_template(TELL_A_STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_template)
    return story_chain.run(sheet=sheet, memory=memories)


if __name__ == "__main__":
    llm_advanced = ChatOpenAI(model="gpt-4", streaming=True, callbacks=[
        StreamingStdOutCallbackHandler()], temperature=DEFAULT_TEMPATURE)
    llm = ChatOpenAI(model="gpt-3.5-turbo", streaming=True, callbacks=[
        StreamingStdOutCallbackHandler()], temperature=DEFAULT_TEMPATURE)
    story = sys.argv[1]
    character_sheet = initialize_story(llm, story)
    summary = summerize_story(llm, character_sheet)
    recent_memories = extract_initial_memories(llm, summary)
    told_story_one = tell_a_story(
        llm_advanced, character_sheet, recent_memories)
    new_memories = extract_initial_memories(llm, told_story_one)
