import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import prisma from "@/utils/db";
import { Session } from "@auth0/nextjs-auth0";
import { ActionMemory, RecallMemory, User } from "@prisma/client";
import { z } from "zod";
import logger from "@/utils/logger";
import characters from "@/data/characters";

const t = initTRPC.context<{ session: Session; user: User }>().create({
  transformer: superjson,
});

async function storyMetaFromCtx(
  storyMetadataId: string,
  ctx: { user: { id: string } }
) {
  return await prisma.storyMetadata.findFirst({
    where: {
      id: storyMetadataId,
      userId: ctx.user.id,
    },
  });
}

export const appRouter = t.router({
  getPresetCharacters: t.procedure.query(async ({ ctx }) => {
    return characters;
  }),

  getStoryState: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const meta = await prisma.storyMetadata.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!meta) {
        return null;
      }

      if (meta.userId !== ctx.user.id && !meta.published) {
        logger.info({ storyMetaId: meta.id }, "Story is not published");
        return null;
      }

      const [
        characterSheetCount,
        recallMemoryCount,
        actionMemoryCount,
        storyCount,
      ] = await prisma.$transaction([
        prisma.characterSheet.count({
          where: {
            storyMetadataId: meta.id,
          },
        }),
        prisma.recallMemory.count({
          where: {
            storyMetadataId: meta.id,
          },
        }),
        prisma.actionMemory.count({
          where: {
            storyMetadataId: meta.id,
          },
        }),
        prisma.story.count({
          where: {
            storyMetadataId: meta.id,
          },
        }),
      ]);

      logger.info(
        {
          id: meta.id,
          title: meta.title,
          characterSheetCount,
          recallMemoryCount,
          actionMemoryCount,
          storyCount,
        },
        "Story state"
      );

      return {
        id: meta.id,
        title: meta.title,
        hasCharacterSheet: characterSheetCount > 0,
        hasMemories: recallMemoryCount > 0 && actionMemoryCount > 0,
        hasStories: storyCount > 0,
      };
    }),

  listStoryMeta: t.procedure.query(async ({ ctx }) => {
    return await prisma.storyMetadata.findMany({
      select: {
        id: true,
        userId: true,
        title: true,
      },
      where: {
        userId: ctx.user.id,
      },
    });
  }),

  createStoryMeta: t.procedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.storyMetadata.create({
        select: {
          id: true,
        },
        data: {
          title: input.title,
          userId: ctx.user.id,
        },
      });
    }),

  createStoryMemories: t.procedure
    .input(
      z.object({
        storyMetadataId: z.string(),
        memories: z.array(
          z.union([
            z.object({
              type: z.literal("recall"),
              text: z.string(),
              timeAgo: z.string(),
            }),
            z.object({
              type: z.literal("action"),
              text: z.string(),
              importance: z.number(),
            }),
          ])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const meta = await storyMetaFromCtx(input.storyMetadataId, ctx);
      if (!meta) {
        throw new Error("Story not found");
      }

      const recallMemories: Pick<
        RecallMemory,
        "storyMetadataId" | "text" | "timeAgo"
      >[] = [];

      const actionMemories: Pick<
        ActionMemory,
        "storyMetadataId" | "importance" | "text"
      >[] = [];

      for (const memory of input.memories) {
        if (memory.type == "recall") {
          recallMemories.push({
            storyMetadataId: meta.id,
            text: memory.text,
            timeAgo: memory.timeAgo,
          });
        } else if (memory.type == "action") {
          actionMemories.push({
            storyMetadataId: meta.id,
            importance: memory.importance,
            text: memory.text,
          });
        } else {
          throw new Error("Unknown memory type");
        }
      }

      return await prisma.$transaction([
        prisma.recallMemory.createMany({
          data: recallMemories,
        }),
        prisma.actionMemory.createMany({
          data: actionMemories,
        }),
      ]);
    }),

  getSummary: t.procedure
    .input(
      z.object({
        storyMetadataId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const meta = await storyMetaFromCtx(input.storyMetadataId, ctx);
      if (!meta) {
        throw new Error("Story not found");
      }

      const summary = await prisma.summary.findFirst({
        where: {
          storyMetadataId: meta.id,
        },
      });

      return summary;
    }),

  getPreviousStory: t.procedure
    .input(
      z.object({
        storyMetadataId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const meta = await storyMetaFromCtx(input.storyMetadataId, ctx);
      if (!meta) {
        throw new Error("Story not found");
      }

      const story = await prisma.story.findFirst({
        where: {
          storyMetadataId: meta.id,
        },
        orderBy: {
          chapter: "desc",
        },
      });

      const allStories = await prisma.story.findMany({
        where: {
          storyMetadataId: meta.id,
        },
        orderBy: {
          chapter: "desc",
        },
      });

      logger.info(
        { storyMetadataId: meta.id, story, allStories },
        "Getting previous story"
      );

      return story;
    }),

  getStory: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await prisma.story.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),

  chooseStoryArc: t.procedure
    .input(
      z.object({
        storyMetadataId: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const meta = await storyMetaFromCtx(input.storyMetadataId, ctx);
      if (!meta) {
        throw new Error("Story not found");
      }

      logger.info(
        { storyMetadataId: meta.id, prompt: input.prompt },
        "Choosing story arc"
      );

      const previousStory = await prisma.story.findFirst({
        where: {
          storyMetadataId: meta.id,
        },
        orderBy: {
          chapter: "desc",
        },
      });

      return await prisma.story.create({
        data: {
          storyMetadataId: meta.id,
          userId: ctx.user.id,
          prompt: input.prompt,
          generated: false,
          chapter: (previousStory?.chapter || 1) + 1,
          text: "",
        },
      });
    }),
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple
