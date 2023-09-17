import { BaseTemplate } from "../templates/base";

export function formatIfNeeded(input: string | BaseTemplate) {
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
