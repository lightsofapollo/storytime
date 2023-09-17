import { OpenAIStream } from "ai";
import OpenAI from "openai";
import { getEncoding, Tiktoken } from "js-tiktoken";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { OPENAI_COSTS, OpenAICostModel } from "../cost";
import { Session, StreamOptions, MessageType, formatIfNeeded } from "./session";

export class OpenAISession extends Session {
  openai: OpenAI;
  encoder: Tiktoken;
  model: ChatCompletionCreateParamsBase["model"];
  costModel: OpenAICostModel;

  constructor(model: ChatCompletionCreateParamsBase["model"]) {
    super();
    this.model = model;
    this.openai = new OpenAI();
    this.encoder = getEncoding("gpt2");
    if (!OPENAI_COSTS[model]) {
      throw new Error(`No cost model for ${model}`);
    }
    this.costModel = OPENAI_COSTS[model];
  }

  async createStream(options: StreamOptions): Promise<ReadableStream> {
    const messages = [];
    let inputTokens = 0;

    if (options.systemMessage) {
      messages.push({
        role: MessageType.SYSTEM,
        content: formatIfNeeded(options.systemMessage),
      });
    }

    for (const message of options.messages) {
      messages.push({
        role: message.role || MessageType.USER,
        content: formatIfNeeded(message.content),
      });
    }

    for (const message of messages) {
      inputTokens += this.encoder.encode(message.content).length;
    }

    const completion = await this.openai.chat.completions.create({
      model: this.model,
      stream: true,
      messages,
      max_tokens: options.maxTokens,
      temperature: options.tempature,
    });

    let outputTokens = 0;
    const onToken = async (token: string) => {
      outputTokens++;
      if (options.onToken) {
        return await options.onToken(token);
      }
    };

    let startTime = 0;
    const onStart = async () => {
      startTime = Date.now();
      if (options.onStart) {
        return await options.onStart();
      }
    };

    const onCompletion = async (completion: string) => {
      const totalTokens = inputTokens + outputTokens;

      let cost = inputTokens * this.costModel.inputTokenCost;
      cost += outputTokens * this.costModel.outputTokenCost;

      if (options.onCompletion) {
        return await options.onCompletion(completion, {
          cost,
          inputTokens,
          outputTokens,
          totalTokens,
          totalTime: Date.now() - startTime,
        });
      }
    };

    return OpenAIStream(completion, {
      onStart,
      onCompletion,
      onFinal: options.onFinal,
      onToken,
    });
  }
}
