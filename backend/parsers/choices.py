import re


START_REGEXP = r"^[0-9]+. "

class Choice():
    choice: str

    def __init__(self, choice: str):
        self.choice = choice

    def __str__(self):
        return f"{self.choice}"


def parse_choices(input: str) -> list[Choice]:
    """Parses the input and returns a list of Choice objects"""
    choices = []
    for line in input.splitlines():
        print(line)
        if re.match(START_REGEXP, line):
            choices.append(Choice(line.replace(START_REGEXP, "").strip()))
        else:
            print('miss')
    return choices
