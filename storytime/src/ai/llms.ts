import { BaseSession, Costs, StreamOptions } from "./llms/base_session";
import { OpenAISession } from "./llms/openai";
import { MOCK_CHARACTER_SHEET } from "./templates/character_sheet";
import { MockSession } from "./llms/mock";
import prisma from "@/utils/db";
import logger from "@/utils/logger";
import { MOCK_MEMORY_OUTPUT } from "./templates/memory";
import { ReplicateSession } from "./llms/replicate";
import { MOCK_TELL_NEXT_STORY } from "./templates/tell_next_story";
import { FireworksSession } from "./llms/fireworks";

export type SessionOptions<CTX> = {
  onCompletion: (
    ctx: CTX,
    cost: Costs,
    completion: string,
    opts: StreamOptions
  ) => Promise<void> | void;
  session: (ctx: CTX) => BaseSession;
  mock: string[];
};

function llmSession<T>(opts: SessionOptions<T>) {
  return function (ctx: T) {
    const session =
      process.env.NODE_ENV === "test"
        ? new MockSession(opts.mock)
        : opts.session(ctx);

    return {
      createStream: (options: StreamOptions) => {
        return session.createStream({
          ...options,
          onCompletion: async (completion, costs) => {
            try {
              await opts.onCompletion(ctx, costs, completion, options);
            } catch (err) {
              logger.error({ err }, "Error in onCompletion");
            }
            if (options.onCompletion) {
              return await options.onCompletion(completion, costs);
            }
          },
        });
      },
    };
  };
}

type StoryMetaCtx = {
  storyMetadataId: string;
};

export class LLMs {
  characterSheet = llmSession<StoryMetaCtx>({
    mock: [MOCK_CHARACTER_SHEET],
    async onCompletion(
      ctx: { storyMetadataId: string },
      cost,
      completion,
      opts
    ) {
      await prisma.cost.create({
        data: {
          action: "characterSheet",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
        },
      });
    },
    session() {
      return new OpenAISession("gpt-3.5-turbo");
    },
  });

  summary = llmSession<StoryMetaCtx>({
    mock: ["a cool summary", "a bad summary"],
    session() {
      return new OpenAISession("gpt-3.5-turbo");
    },
    async onCompletion(
      ctx: { storyMetadataId: string },
      cost,
      completion,
      opts
    ) {
      await prisma.cost.create({
        data: {
          action: "summary",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
        },
      });
    },
  });

  memories = llmSession<StoryMetaCtx & { storyId?: string }>({
    mock: [MOCK_MEMORY_OUTPUT],
    session() {
      return new OpenAISession("gpt-3.5-turbo");
    },
    async onCompletion(ctx, cost, completion, opts) {
      await prisma.cost.create({
        data: {
          action: "memories",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
          storyId: ctx.storyId,
        },
      });
    },
  });

  tellFirstStory = llmSession<StoryMetaCtx>({
    mock: ["a cool story", "a bad story"],
    session() {
      return new FireworksSession(
        "accounts/fireworks/models/llama-v2-70b-8k-chat-w8a16"
      );
      return new ReplicateSession(
        "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d"
      );
    },
    async onCompletion(ctx, cost, completion, opts) {
      await prisma.cost.create({
        data: {
          action: "tellFirstStory",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
        },
      });
    },
  });

  storyChoices = llmSession<StoryMetaCtx & { storyId: string }>({
    mock: [MOCK_TELL_NEXT_STORY],
    session() {
      return new OpenAISession("gpt-3.5-turbo");
    },
    async onCompletion(ctx, cost, completion, opts) {
      await prisma.cost.create({
        data: {
          action: "storyChoices",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
          storyId: ctx.storyId,
        },
      });
    },
  });

  tellNextStory = llmSession<StoryMetaCtx>({
    mock: ["a cool story", "a bad story"],
    session() {
      return new FireworksSession(
        "accounts/fireworks/models/llama-v2-70b-8k-chat-w8a16"
      );

      return new ReplicateSession(
        "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d"
      );
    },
    async onCompletion(ctx, cost, completion, opts) {
      await prisma.cost.create({
        data: {
          action: "tellNextStory",
          storyMetadataId: ctx.storyMetadataId,
          cost: cost.cost,
        },
      });
    },
  });
}
