TITLE_TEMPLATE = """
Given the following character sheet provide a four word book title that should be unique

<Character>
{sheet}
</Character>
"""

STORY_TEMPLATE = """
Fill out the character sheet with the following general context in <Story>. The output should use the examples but not closely resemble them instead using unique text.

<Story>
{story}
</Story>

<Character>:

Character Name: Example: Alex Adventureton
Nickname: Example: Al or Adventurer A
Age: Example: 12
Birthplace: Example: Hometown, USA
Current Residence: Example: Fantasyville
Occupation: Example: Student, amateur detective
Education: Example: Middle School

Family Background: Example: Lives with mom, Dad's a pilot, pet turtle Timmy
Personal History: Example: Solved haunted library mystery, loves adventures

PHYSICAL

Height: Example: 5"1
Weight: Example: 110LB
Build: Example: Athletic
Hair: Example: Brown, curly
Eyes: Example: Blue
Skin: Example: Fair
Features: Example: Freckles, glasses
Clothing: Example: Cargo pants, t-shirts, hat

PERSONALITY

Demeanor: Example: Curious, outgoing
Values: Example: Friendship, courage
Strengths: Example: Loyal, brave, good at puzzles
Weaknesses: Example: Impulsive, forgetful
Fears: Example: Heights, spiders
Hobbies: Example: Hiking, reading, video games
Foods: Example: Pizza, cookies
Habits: Example: Finger tapping, says "Hmm"
Likes: Example: Adventure, animals, treasure maps
Dislikes: Example: Bullies, homework

SKILLS

General: Example: Riddle-solving, swimming, running
Special: Example: Speaks to animals (secret)
Powers: Example: None
Limitations: Example: Eye contact for animal speaking

RELATIONSHIPS

Family: Example: Mom (Julie), Dad (Steve)
Friends: Example: Sarah (best friend), Mr. Jenkins (mentor)
Significant Others: Example: None
Enemies: Example: Tim the bully, Mysterious Thief X

GOALS

Short-Term: Example: Solve cookie mystery, pass math
Long-Term: Example: Become detective, explore ruins
Motivations: Example: Curiosity, justice, adventure

FLAWS

Personal: Example: Too trusting, impulsive
Challenges: Example: Afraid of heights, focus issues
Failures: Example: Got lost in woods on a trip

SECRETS

Known: Example: Found old treasure map
Unknown: Example: Map leads to another dimension

EXTRA

Equipment: Example: Special compass
Past Locations: Example: Haunted Library, Grandma's cabin
Past Events: Example: Solved Library mystery, found treasure chest
Other Info: Example: Allergic to peanuts, likes to whistle

</Character>
"""


SUMMARY_TEMPLATE = """
Create a medium form summary in paragraph form of the following character sheet include all relevant details but remove the field preceding the actual description. Be sure to include all details.

{sheet}
"""

MEMORY_FILL_TEMPLATE = """
Given the following character summary step-by-step hypothesize what the most recent memories and actions the character has taken in the story.

This should take the following form:

Action: Action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).
   * Breakup (10)
   * Brushing teeth (1)


Memory:  memory description (Days ago)
   * Created a beautiful painting (50 days ago)
   * Went to store (10 days ago)


The full list should look like this as an example:

Memory: memory description (Days ago)
Memory: second memory description (Days ago)
Action: Action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).
Action: second action description (Level of relevance, where 1 is brushing teeth and 10 is college breakup).


Include 5 memories and 5Z

{summary}
"""


TELL_A_STORY_TEMPLATE = """

Using the following character sheet tell a rich story full of dialog about the character. The story should be engaging and interesting and should be at least 1000 words long. 

<character sheet>
{sheet}
</character sheet>

Include the most relevant recent memories and actions from the actions below in the story.

<memory>
{memory}
</memory>
"""

TELL_A_STORY_NEXT_TEMPLATE = """

Using the following character sheet tell a rich story full of dialog about the character. The story should be engaging and create a continuing plot line with new events and memories.

<character sheet>
{sheet}
</character sheet>

Include the most relevant recent memories and actions from the actions below in the story.

<memory>
{memory}
</memory>
"""
