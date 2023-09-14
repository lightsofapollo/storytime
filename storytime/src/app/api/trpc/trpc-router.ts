import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import prisma from "@/utils/db";
import { Session } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";

const t = initTRPC.context<{ session: Session; user: User }>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getUsers: t.procedure.query(({ ctx }) => {
    console.log({ ctx });
    return [];
  }),
});

export type AppRouter = typeof appRouter;

// The code below is kept here to keep things simple
