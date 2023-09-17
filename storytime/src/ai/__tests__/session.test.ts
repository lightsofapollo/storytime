/*
 * @jest-environment node
 */
import { OpenAISession, ReplicateSession } from "../session";
import { text } from "node:stream/consumers";

const maybe = process.env.JEST_E2E ? describe : describe.skip;

function defer(): { promise: Promise<any>; resolve: (value: any) => void } {
  var deferred: any = {};
  deferred.promise = new Promise((resolve) => {
    deferred.resolve = resolve;
  });
  return deferred as any;
}

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
        onStart: async function () {
          console.log("starting...");
        },
        onCompletion: async function (completion, cost) {
          console.log({ completion, cost });
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
        onStart: async function () {
          console.log("starting...");
        },
        onCompletion: async function (completion, cost) {
          console.log({ completion, cost });
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
});
