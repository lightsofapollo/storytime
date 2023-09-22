import { getEncoding } from "js-tiktoken";
import llamaTokenizer from "./vendor/llama-tokenizer-js";

export abstract class Tokenizer {
  abstract encode(string: string): number[];
}

export class LLAMATokenizer extends Tokenizer {
  encode(string: string): number[] {
    return llamaTokenizer.encode(string);
  }
}

export class OpenAITokenizer extends Tokenizer {
  encoder = getEncoding("gpt2");
  encode(string: string): number[] {
    return this.encoder.encode(string);
  }
}
