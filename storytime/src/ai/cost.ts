import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

type KEY = ChatCompletionCreateParamsBase["model"];

export type OpenAICostModel = {
  inputTokenCost: number;
  outputTokenCost: number;
};

export const OPENAI_COSTS: {
  [key: string]: OpenAICostModel;
} = {
  "gpt-4": {
    inputTokenCost: 0.03 / 1000,
    outputTokenCost: 0.06 / 1000,
  },
  "gpt-4-0314": {
    inputTokenCost: 0.03 / 1000,
    outputTokenCost: 0.06 / 1000,
  },
  "gpt-4-0613": {
    inputTokenCost: 0.03 / 1000,
    outputTokenCost: 0.06 / 1000,
  },
  "gpt-4-32k": {
    inputTokenCost: 0.06 / 1000,
    outputTokenCost: 0.12 / 1000,
  },
  "gpt-4-32k-0314": {
    inputTokenCost: 0.06 / 1000,
    outputTokenCost: 0.12 / 1000,
  },
  "gpt-4-32k-0613": {
    inputTokenCost: 0.06 / 1000,
    outputTokenCost: 0.12 / 1000,
  },
  "gpt-3.5-turbo": {
    inputTokenCost: 0.0015 / 1000,
    outputTokenCost: 0.002 / 1000,
  },
  "gpt-3.5-turbo-16k": {
    inputTokenCost: 0.003 / 1000,
    outputTokenCost: 0.004 / 1000,
  },
  "gpt-3.5-turbo-0301": {
    inputTokenCost: 0.0015 / 1000,
    outputTokenCost: 0.002 / 1000,
  },
  "gpt-3.5-turbo-0613": {
    inputTokenCost: 0.0015 / 1000,
    outputTokenCost: 0.002 / 1000,
  },
  "gpt-3.5-turbo-16k-0613": {
    inputTokenCost: 0.003 / 1000,
    outputTokenCost: 0.004 / 1000,
  },
};
