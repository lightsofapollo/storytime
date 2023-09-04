import argparse
from pathlib import Path
from db.local import StoryDatabase
import dotenv
import inquirer
from llm import create_analysis_llm, create_story_llm, extract_memories, get_relevant_story_memories, get_story_choices, tell_next_story
from parsers.choices import parse_choices

dotenv.load_dotenv()

if __name__ == "__main__":
    analysis_llm = create_analysis_llm()
    story_llm = create_story_llm()

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
    choices_raw = get_story_choices(analysis_llm, lastest_story)
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
    relevant_memories = get_relevant_story_memories(analysis_llm, choice, recent_memories)

    sheet = db.get_character_sheet()
    next_story = tell_next_story(story_llm, choice, sheet, lastest_story, relevant_memories)
    new_memories = extract_memories(analysis_llm, next_story)
    db.add_new_memories(new_memories)
    db.save_new_story(next_story)




