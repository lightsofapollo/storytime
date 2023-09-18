import { BaseSession, StreamOptions } from "./base_session";

const CHUNK = 4;

async function iteratorToStream(
  opts: StreamOptions,
  completion: string,
  iterator: AsyncIterableIterator<string>
) {
  if (opts.onStart) {
    await opts.onStart();
  }
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        if (opts.onFinal) {
          await opts.onFinal(completion);
        }
        if (opts.onCompletion) {
          await opts.onCompletion(completion, {
            totalTokens: opts.maxTokens || 0,
            inputTokens: opts.maxTokens || 0,
            outputTokens: opts.maxTokens || 0,
            totalTime: 0,
            cost: 0,
          });
        }
        controller.close();
      } else {
        controller.enqueue(value);
        if (opts.onToken) {
          await opts.onToken(value);
        }
      }
    },
  });
}

export class MockSession extends BaseSession {
  outputs: string[] = [];

  constructor(outputs: string[]) {
    super();
    this.outputs = outputs;
  }

  async createStream(options: StreamOptions): Promise<ReadableStream> {
    const output =
      this.outputs[Math.floor(Math.random() * this.outputs.length)];

    async function* iterator() {
      for (let i = 0; i < output.length; i += CHUNK) {
        yield output.slice(i, i + CHUNK);
      }
    }

    return await iteratorToStream(options, output, iterator());
  }
}

export function sessionWithMockFallback(
  sessionGen: () => BaseSession,
  mock: string[]
): BaseSession {
  if (process.env.NODE_ENV === "test") {
    return new MockSession(mock);
  }
  return sessionGen();
}
