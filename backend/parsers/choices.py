import re

from pydantic import BaseModel


START_REGEXP = r"^[0-9]+.(.*)"


class Choice(BaseModel):
    choice: str

    def __str__(self):
        return f"{self.choice}"


def parse_choices(input: str) -> list[Choice]:
    """Parses the input and returns a list of Choice objects"""
    choices = []
    for line in input.splitlines():
        matches = re.match(START_REGEXP, line)
        if matches:
            choice = matches.group(1).strip()
            choices.append(Choice(choice=choice))
    return choices
