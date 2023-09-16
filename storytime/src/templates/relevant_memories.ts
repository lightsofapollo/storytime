import { BaseTemplate } from "./base";

export default class RelevantMemoriesTemplate extends BaseTemplate {
  constructor(state: string, memories: string) {
    super();
    this.template = `
        Reduce the list of memories and actions to those most similar to the state provided.

        For example given the following action "Go to the store" and the following memories
        
        Memory: Need food (1 day ago)
        Memory: Need food (360 days ago)
        Action: cooked dinner (5)
        Action: Went to work (2)
        
        Output:
        
        Memory: Need food (1 days ago)
        Action: cooked dinner (5)
        
        Do not include prelude. 
        
        State: "${state}"
        
        ${memories}
        `;
  }
}
