import { PresetCharacter } from "@prisma/client";
import endent from "endent";

const DE7EN_BRIEF = endent`
Expand upon the writing style and tone to provide a writer's brief for authoring a story

3. Emotional Journey through Flashbacks and Time Loops

High-Level Tone: This writing style would focus on De7en coming to terms with their past while going on adventures in the present. It will be a bit more serious but will still have lighter, comedic moments to balance things out. Through flashbacks or time loops, De7en might revisit their past in Pantik and learn lessons that help them solve challenges in the present.



In-Depth Dialog: In this style, dialog would range from casual and funny to deep and emotional. For instance, De7en might say to Flauta during an adventure, "This treasure hunt is just like the time in Pantik when we had to find fresh water. Except now, instead of water, we're after something shinier!" This style would allow for a balance of nostalgia and humor, with De7en often using past experiences to shed light on their current adventures.

Writer's Brief: Emotional Journey through Flashbacks and Time Loops

High-Level Tone

The emotional tapestry of this chapter book will be a mixture of wistfulness, nostalgia, and humor, with sporadic bursts of action and adventure. Our protagonist, De7en, is faced with an emotional journey that links their past and present, often meshed through magical flashbacks or perplexing time loops. The story must lean into the more serious themes but should be punctuated with lighter, comedic moments to ensure the narrative stays accessible and entertaining for our 10-year-old audience.

Key Elements

Flashbacks and Time Loops

Our storytelling device here is crucial; flashbacks and time loops serve as the emotional and thematic backbone. These aren't just plot gimmicks. They're interwoven with the present-day storyline, acting as keys that unlock solutions or bring about character growth.

Setting

The adventures unfold mainly in two worlds: The mythical realm of Pantik, rich with history and sentimental value for De7en, and a present-day fantastical universe where De7en is knee-deep in treasure hunts, monster slayings, or world-saving escapades.

Characters

* De7en: A skilled adventurer with a touch of melancholy, always quick with a joke or a snappy comeback.
* Flauta: De7en's trusty sidekick who is not just the comic relief but also the emotional support and often the voice of reason.
* Villains: A range of baddies, who are not just evil but also complex, making De7en and the reader rethink the notion of good and bad.

Comedy

While we're dabbling in existential questions and emotional journeys, the story must remain funny. Wit, puns, and clever banter are essential in both dialog and narrative voice.

In-Depth Dialog

Dialog is where the story's tone truly shines. It will have a dynamic range—from laugh-out-loud funny to reflective and poignant. Conversations between De7en and Flauta will be rich, engaging, and relatable. Lines like De7en reminiscing, "This treasure hunt is just like the time in Pantik when we had to find fresh water. Except now, instead of water, we're after something shinier!" showcase the narrative's intricate balance between nostalgia and humor.

Example Dialog Themes:

1. Casual Banter: "You know, Flauta, this treasure chest better have Wi-Fi."
2. Deep Emotional Moments: "Flauta, do you ever wonder if we're doing the right thing? What if we're just pirates with a fancy compass?"
3. Humor with Nostalgia: "Ah, this takes me back to Pantik. Back then, our treasure was a hot meal and a dry place to sleep!"

Key Takeaways

In a nutshell, we're creating a multilayered story that feels like an emotional roller coaster—a smooth blend of touching flashbacks and hair-raising adventures in the present. Dialog serves as the heart and soul, with enough humor to keep our young readers hooked, but enough depth to make them pause and think. It's about the journey of De7en coming to terms with their past, even as they forge ahead into the unknown future.

So, let's make this a captivating, humorous, and emotionally satisfying ride for De7en, Flauta, and of course, our readers.
`;

const characters: Omit<PresetCharacter, "id">[] = [
  {
    name: "De7en",
    description: "10-year-old human",
    prompt: endent`
      Could you create a character sheet for De7en? They’re a 10-year-old human who was born in Pantik, a war-torn country on the planet Amoulence. They fled Pantik with their parents, Peet and Ginge, when they were seven years old. Now they live in the country of Fleescopic in a large, bustling metropolis called Tip-Ompus. Although it took them a while to get comfortable, they are now thriving in their new home. They love going on adventures in the city, coming up with experiments in their basement, and exploring mysteries with their best friends from school, Skim and Flauta. De7en is often amazed at the things they discover in Tip-Ompus, but also get anxious when they encounter things that remind them of the scary stuff they saw during the war in Pantik. They hope that someday they can use their love of science, reading, and history to make Amoulence a more beautiful and peaceful planet. Let’s flesh out De7en’s personality, history, relationships, and more. 
    `,
    brief: DE7EN_BRIEF,
  },

  {
    name: "Dr. Paleo",
    description: "Space archeologist",
    prompt: endent`
      Could you create a character sheet for Dr. Paleo, a space archeologist? He and his family travel to a distant galaxy to learn about ancient civilizations on distant planets and moons. He loves mountain and desert-heavy planets but is afraid of water. His partner is a famous writer who writes stories about their many adventures in an interplanetary blog and book series. Dr. Paleo is smart, curious, and serious, but his family is silly and adventurous. They are always encouraging him to have fun and try new things. Together Dr. Paleo, his partner, and his two kids make new friends, eat delicious foods, and are always lost. Luckily, they travel with a giant golden retriever who can smell danger and speaks their language. They live in a big flying camper van and collect friends, pets, and traveling companions along the way. Let's flesh out his personality, history, relationships, and more.
    `,
    brief: null,
  },
  {
    name: "Abbie Eau",
    description: "Underwater pod racer",
    prompt: endent`
      Could you create a character sheet for Abbie Eau? She is a bronze medalist in international underwater pod racing. She’s tall and has light blue skin, so she blends in with the water while racing, but she drives a bright pink pod. She can breathe underwater and loves driving, traveling, and building things. Even though she races underwater, she lives on land in a house she built with her best friends, Isa and Micah. They love to build things–pods, hovercars, and their house. Abbie is known for breaking as many things as she builds, being fiercely competitive, her loyalty, and always running late. She’s been traveling the world when she’s not building, competing in races to qualify for the underwater pod racing Olympics. She has a friendly rivalry with fellow competitor Denzin, who beat her in the last competition. Let's flesh out her personality, history, relationships, and more.
    `,
    brief: null,
  },
  {
    name: "Scoops",
    description: "Small, adorable, golden chihuahua",
    prompt: endent`
      Could you create a character sheet for Scoops? She’s a small, adorable, golden chihuahua who probably knows more than she’s letting on. She enjoys sunbathing on the front porch and snacking on cheese. She dislikes noisy birds, anything on wheels, closed doors, and being ignored. Scoops is 10 human years old, though her soul has lived many lives across time and space. She loves people, but she has a healthy distrust of other dogs (except for her best dog friend Ollie). Her daily walks are a combination of joyful exercise and intense neighborhood patrol — she’s very suspicious. She may or may not have a secret spy journal. Let’s flesh out her history, relationships, personality, and more.
    `,
    brief: null,
  },
  {
    name: "Charlie Powerkrab",
    description: "107-year-old naturing loving wizard",
    prompt: endent`
      Could you create a character sheet for Charlie Powerkrab? He's a 107-year-old wizard who lives in a mystical treehouse in the woods. He's 4 feet tall, has long, wiry red hair, and a purple mustache. Charlie hates deforestation and industrialization, but loves crabbing, cooking, farming, and foraging for enchanted glow-in-the-dark carrots. His best wizard friend Quagmire lives on a distant planet, and his enemies are the Astro Rabbits, a space engineering company building a launch pad in his backyard. Let's flesh out his personality, relationships, history, and more.
    `,
    brief: null,
  },
  {
    name: "Helix Crick",
    description: "6 1/2-year-old tornado",
    prompt: endent`
      Could you create a character sheet for Helix Crick? She's a 6 1/2-year-old tornado who changes color depending on her mood and what she's consumed. She's attending her first year of tornado school, and her science teacher Bodhi introduces her to new facts and helps her get out of trouble. Helix is mischievous but kind, very smart and curious, which can sometimes get her into trouble. She loves science and learning about space. One day she'd love to go to space and see the earth from above. Let's flesh out her personality, history, relationships, and more.
    `,
    brief: null,
  },
];

export default characters;
