import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import prisma from "@/utils/db";
import { Session } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";
import { z } from "zod";

const t = initTRPC.context<{ session: Session; user: User }>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getUsers: t.procedure.query(({ ctx }) => {
    console.log({ ctx });
    return [];
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
