import argparse
from pathlib import Path
from db.local import StoryDatabase
import dotenv
import inquirer
from langchain.chat_models import ChatOpenAI
from langchain.llms import Replicate
from langchain.output_parsers import ListOutputParser
from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler
from llm import analysis_llm
from parsers.choices import parse_choices
from parsers.memory import parse_into_memory
from templates import GET_ACTION_TEMPLATE, GET_RELEVANT_MEMORIES_TEMPLATE


dotenv.load_dotenv()

def get_relevant_story_memories(llm: BaseLLM, state: str, memories: str):
    story_chain_prompt_template = PromptTemplate.from_template(
        GET_RELEVANT_MEMORIES_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_chain_prompt_template)
    return story_chain.run(state=state, memories=memories)


def get_story_choices(llm: BaseLLM, story: str):
    story_chain_prompt_template = PromptTemplate.from_template(
        GET_ACTION_TEMPLATE)
    story_chain = LLMChain(
        llm=llm, prompt=story_chain_prompt_template)
    return story_chain.run(story=story)

if __name__ == "__main__":
    analysis = analysis_llm()
    parser = argparse.ArgumentParser(
        prog="continue_story", description="Continue a story by file directory")
    parser.add_argument("filename", type=str)
    args = parser.parse_args()
    db_path = Path(args.filename)
    if not db_path.exists():
        print("Filename does not exist")
        exit(1)

    db = StoryDatabase(db_path)
    lastest_story = db.latest_story()

    print("Currently in the story...")
    print(lastest_story)

    memories = db.get_memory()
    choices_raw = get_story_choices(analysis, lastest_story)
    choices = parse_choices(choices_raw)

    question_list = []
    for choice in choices:
        question_list.append(choice.choice)

    questions = [
        inquirer.List(
            "choice",
            message="What choice do you want to continue?",
            choices=question_list,
            carousel=True)
    ]
    answer = inquirer.prompt(questions)
    choice = answer["choice"]
    recent_memories = "\n".join(map(lambda x: str(x), memories[:100]))
    relevant_memories_raw = get_relevant_story_memories(analysis, choice, recent_memories)
    relevant_memories = parse_into_memory(relevant_memories_raw) 

    for relevant_memory in relevant_memories:
        print(str(relevant_memory))




