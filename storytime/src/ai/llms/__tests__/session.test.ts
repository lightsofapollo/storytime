/*
 * @jest-environment node
 */
import { ReplicateSession } from "../replicate";
import { OpenAISession } from "../openai";
import { MockSession } from "../mock";
import { text } from "node:stream/consumers";
import { FireworksSession } from "../fireworks";

const maybe = process.env.JEST_E2E ? describe : describe.skip;

function defer(): { promise: Promise<any>; resolve: (value: any) => void } {
  var deferred: any = {};
  deferred.promise = new Promise((resolve) => {
    deferred.resolve = resolve;
  });
  return deferred as any;
}

describe("mock session", () => {
  it("should mock session", async () => {
    const result = "i am the result and I am longer than the chunk size";
    const session = new MockSession([result]);
    const deferred = defer();
    const stream = await session.createStream({
      messages: [{ content: "Hello this is a world of amazing ai things" }],
      maxTokens: 10,
      onCompletion: async function (completion, cost) {
        expect(cost.cost).toBe(0);
        deferred.resolve(null);
      },
    });
    // consume the whole stream...
    const output = await text(stream as any);
    expect(output).toBe(result);
    await deferred.promise;
  });
});

maybe("session", () => {
  it(
    "it should measure costs for replicate",
    async () => {
      const session = new ReplicateSession(
        "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d"
      );
      const deferred = defer();
      const stream = await session.createStream({
        messages: [{ content: "Hello this is a world of amazing ai things" }],
        maxTokens: 10,
        onCompletion: async function (completion, cost) {
          expect(cost.cost).toBeGreaterThan(0);
          deferred.resolve(null);
        },
      });
      // consume the whole stream...
      const _ = await text(stream as any);
      await deferred.promise;
    },
    30 * 1000
  );

  it(
    "it should measure costs for openai",
    async () => {
      const session = new OpenAISession("gpt-3.5-turbo");
      const deferred = defer();
      const stream = await session.createStream({
        messages: [{ content: "Hello this is a world of amazing ai things" }],
        maxTokens: 10,
        onCompletion: async function (completion, cost) {
          expect(cost.cost).toBeGreaterThan(0);
          expect(cost.inputTokens).toBe(10);
          expect(cost.outputTokens).toBe(10);
          deferred.resolve(null);
        },
      });
      // consume the whole stream...
      const _ = await text(stream as any);
      await deferred.promise;
    },
    30 * 1000
  );

  it(
    "it should measure costs for fireworks",
    async () => {
      const session = new FireworksSession(
        "accounts/fireworks/models/llama-v2-70b-8k-chat-w8a16"
      );
      const deferred = defer();
      const stream = await session.createStream({
        messages: [{ content: "Hello this is a world of amazing ai things" }],
        maxTokens: 10,
        onCompletion: async function (completion, cost) {
          expect(cost.cost).toBe(0);
          deferred.resolve(null);
        },
      });
      // consume the whole stream...
      const _ = await text(stream as any);
      await deferred.promise;
    },
    30 * 1000
  );
});
