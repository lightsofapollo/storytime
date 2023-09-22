import { Tokenizer } from "../tokenizer";

export class SizedTokenBuilder {
  readonly tokenLimit: number;
  readonly tokenizer: Tokenizer;
  tokenCount = 0;
  private _output: string[] = [];

  constructor(tokenizer: Tokenizer, tokenLimit: number) {
    this.tokenizer = tokenizer;
    this.tokenLimit = tokenLimit;
    this._output = [];
  }

  measure(value: string) {
    return this.tokenizer.encode(value).length;
  }

  remainder() {
    return this.tokenLimit - this.tokenCount;
  }

  append(value: string): boolean {
    if (this.remainder() <= 0) {
      return false;
    }
    const tokens = this.measure(value);
    if (this.tokenCount + tokens < this.tokenLimit) {
      this.tokenCount += tokens;
      this._output.push(value);
      return true;
    }
    return false;
  }

  output(): string {
    return this._output.join("");
  }
}
