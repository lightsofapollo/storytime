import { Message } from "ai";
import { experimental_buildLlama2Prompt } from "ai/prompts";

enum TemplateModelTypes {
  OPENAI,
  LLAMA2,
}

type RoleTypes = Pick<Message, "role">;

export abstract class BaseTemplate {
  template: string = "";

  format(
    modelType: TemplateModelTypes = TemplateModelTypes.OPENAI,
    role?: RoleTypes
  ): string {
    switch (modelType) {
      case TemplateModelTypes.OPENAI:
        return this.template;
      case TemplateModelTypes.LLAMA2:
        return experimental_buildLlama2Prompt([
          {
            content: this.template,
            role: "user",
          },
        ]);
    }
  }
}
