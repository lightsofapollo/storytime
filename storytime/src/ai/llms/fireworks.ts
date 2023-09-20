import { OpenAIStream } from "ai";
import OpenAI from "openai";
import { getEncoding, Tiktoken } from "js-tiktoken";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { OPENAI_COSTS, OpenAICostModel } from "../cost";
import {
  BaseSession,
  StreamOptions,
  MessageType,
  formatIfNeeded,
} from "./base_session";

export class FireworksSession extends BaseSession {
  openai: OpenAI;
  model: string;

  constructor(model: string) {
    super();
    this.model = model;
    this.openai = new OpenAI({
      baseURL: "https://api.fireworks.ai/inference/v1",
      apiKey: process.env.FIREWORKS_API_KEY,
    });
  }

  async createStream(options: StreamOptions): Promise<ReadableStream> {
    const messages = [];

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
      if (options.onCompletion) {
        return await options.onCompletion(completion, {
          cost: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
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
