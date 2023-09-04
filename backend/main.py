import os
import dotenv
import sys
from langchain.chat_models import ChatOpenAI
from langchain.llms import Replicate
from langchain.output_parsers import ListOutputParser
from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler
from datetime import datetime
from constants import CHARACTER_SHEET_FILE, DEFAULT_TEMPATURE, INITIAL_STORY_FILE, INITIAL_STORY_LENGTH, MEMORY_FILE, SUMMARY_FILE, MemoryStreamType
from llm import analysis_llm, story_llm
from parsers.memory import parse_into_memory

from templates import MEMORY_FILL_TEMPLATE, STORY_TEMPLATE, SUMMARY_TEMPLATE, TELL_A_STORY_TEMPLATE, TITLE_TEMPLATE

dotenv.load_dotenv()


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


def extract_initial_memories(llm: BaseLLM, summary: str):
    memory_template = PromptTemplate.from_template(MEMORY_FILL_TEMPLATE)
    memory_chain = LLMChain(
        llm=llm, prompt=memory_template)
    output = memory_chain.run(summary=summary)
    return parse_into_memory(output)


def tell_a_story(llm: BaseLLM, sheet: str, memories: str):
    story_template = PromptTemplate.from_template(TELL_A_STORY_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_template)
    return story_chain.run(sheet=sheet, memory=memories)


if __name__ == "__main__":
    gpt35 = analysis_llm()
    replicate = story_llm() 
    story = sys.argv[1]
    character_sheet = initialize_story(gpt35, story)
    story_init_name = f"{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}"
    data_dir = f"local/{story_init_name}/data"
    story_dir = f"local/{story_init_name}/stories"
    os.makedirs(story_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    with open(f"{data_dir}/{CHARACTER_SHEET_FILE}", "w") as f:
        f.write(character_sheet)
    summary = summerize_story(gpt35, character_sheet)
    with open(f"{data_dir}/{SUMMARY_FILE}", "w") as f:
        f.write(summary)
    recent_memories = extract_initial_memories(gpt35, summary)
    told_story_one = tell_a_story(
        replicate, character_sheet, recent_memories)
    with open(f"{story_dir}/{INITIAL_STORY_FILE}", "w") as f:
        f.write(told_story_one)
    memories = parse_into_memory(recent_memories)
    new_memories_text = extract_initial_memories(gpt35, told_story_one)
    new_memories = parse_into_memory(new_memories_text)
    with open(f"{data_dir}/{MEMORY_FILE}", "w") as f:
        for memory in memories:
            f.write(str(memory) + "\n")
        for memory in new_memories:
            f.write(str(memory) + "\n")
