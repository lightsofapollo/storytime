import { ReplicateStream } from "ai";
import Replicate from "replicate";
import { experimental_buildLlama2Prompt } from "ai/prompts";
import {
  BaseSession,
  StreamOptions,
  formatIfNeeded,
  MessageType,
} from "./base_session";

export class ReplicateSession extends BaseSession {
  replicate: Replicate;
  version: string;
  llamaPrompt?: boolean = true;
  // https://replicate.com/pricing for A40
  gpuCost: number = 0.000725;

  constructor(
    version: string,
    llamaPrompt: boolean = true,
    gpuCost: number = 0.000725
  ) {
    super();
    this.version = version;
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || "",
    });
    this.llamaPrompt = llamaPrompt;
    this.gpuCost = gpuCost;
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

        await options.onCompletion(completion, {
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
