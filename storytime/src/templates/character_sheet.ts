import { BaseTemplate } from "./base";
import endent from "endent";

export class CharacterSheetTemplate extends BaseTemplate {
  constructor(story: string) {
    super();
    this.template = endent`
        Fill out the character sheet with the following general context in <Story>. The output should use the examples but not closely resemble them instead using unique text.

        <Story>
        ${story}
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
    `;
  }
}
