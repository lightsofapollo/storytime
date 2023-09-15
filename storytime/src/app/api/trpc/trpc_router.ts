import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import prisma from "@/utils/db";
import { Session } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";
import { z } from "zod";
import logger from "@/utils/logger";

const t = initTRPC.context<{ session: Session; user: User }>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getUsers: t.procedure.query(({ ctx }) => {
    console.log({ ctx });
    return [];
  }),

  getStoryState: t.procedure
    .input(
      z.object({
        id: z.number(),
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

      // this is not the current users story...
      const characterSheetCount = await prisma.characterSheet.count({
        where: {
          storyMetadataId: meta.id,
        },
      });

      const summaryCount = await prisma.summary.count({
        where: {
          storyMetadataId: meta.id,
        },
      });

      return {
        id: meta.id,
        title: meta.title,
        hasCharacterSheet: characterSheetCount > 0,
        hasSummary: summaryCount > 0,
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
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple
