import { AIStream, OpenAIStream, ReplicateStream } from "ai";
import { BaseTemplate } from "./templates/base";
import OpenAI from "openai";
import { getEncoding, Tiktoken } from "js-tiktoken";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { OPENAI_COSTS, OpenAICostModel } from "./cost";
import Replicate from "replicate";
import { experimental_buildLlama2Prompt } from "ai/prompts";

function formatIfNeeded(input: string | BaseTemplate) {
  if (typeof input === "string") {
    return input;
  }

  return input.format();
}

export type Costs = {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalTime: number;
  cost: number;
};

export enum MessageType {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export type Message = {
  role?: MessageType;
  content: string | BaseTemplate;
};

export type StreamOptions = {
  systemMessage?: string | BaseTemplate;
  messages: Message[];
  tempature?: number;
  maxTokens?: number;
  onStart?: () => Promise<void> | void;
  onFinal?: (completion: string) => Promise<void> | void;
  onCompletion?: (completion: string, costs: Costs) => Promise<void> | void;
  onToken?: (token: string) => Promise<void> | void;
};

export abstract class Session {
  abstract createStream(options: StreamOptions): Promise<ReadableStream>;
}

export class ReplicateSession extends Session {
  replicate: Replicate;
  version: string;
  llamaPrompt?: boolean = true;
  gpuCost: number = 0.000725;

  constructor(version: string, llamaPrompt: boolean = true) {
    super();
    this.version = version;
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || "",
    });
    this.llamaPrompt = llamaPrompt;
  }

  async createStream(options: StreamOptions): Promise<ReadableStream> {
    let input = {};

    if (options.systemMessage) {
      input = {
        ...input,
        system_prompt: formatIfNeeded(options.systemMessage),
      };
    }

    if (options.maxTokens) {
      input = {
        ...input,
        max_new_tokens: options.maxTokens,
      };
    }

    if (options.tempature != null) {
      input = {
        ...input,
        temperature: options.tempature,
      };
    }

    let prompt = "";
    if (this.llamaPrompt && options.messages.length > 0) {
      prompt = experimental_buildLlama2Prompt(
        options.messages.map((message) => {
          return {
            role: message.role || MessageType.USER,
            content: formatIfNeeded(message.content),
          };
        })
      );
    } else if (options.messages.length > 1) {
      throw new Error("Too many messages for non llama prompt");
    } else {
      prompt = formatIfNeeded(options.messages[0].content);
    }

    input = {
      ...input,
      prompt,
    };

    const response = await this.replicate.predictions.create({
      stream: true,
      version: this.version,
      input,
    });

    const onCompletion = async (completion: string) => {
      if (options.onCompletion) {
        const query = await this.replicate.predictions.get(response.id);
        const { metrics } = query;
        const predictTime = metrics?.predict_time || 0;
        const totalTime = predictTime * 1000;
        const cost = predictTime * this.gpuCost;

        return await options.onCompletion(completion, {
          cost: cost,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          totalTime,
        });
      }
    };

    return await ReplicateStream(response, {
      onStart: options.onStart,
      onFinal: options.onFinal,
      onToken: options.onToken,
      onCompletion,
    });
  }
}

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
