from parsers.choices import Choice, parse_choices


def test_choices():

    str = """
Good idea here are your list of choices:

1. Go to the store
2. Go to the park
3. Go to the beach
"""

    expected_output = [
        Choice(choice="Go to the store"),
        Choice(choice="Go to the park"),
        Choice(choice="Go to the beach"),
    ]

    output = parse_choices(str)
    assert output == expected_output
