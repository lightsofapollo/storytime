"use server";

import { loggerLink } from "@trpc/client";
import { experimental_nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { cookies } from "next/headers";
import SuperJSON from "superjson";
import { appRouter } from "@/app/api/trpc/trpc_router";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/utils/db";

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (op) => true,
        }),
        experimental_nextCacheLink({
          // requests are cached for 5 seconds
          revalidate: 5,
          router: appRouter,
          createContext: async () => {
            const session = await getSession();
            if (!session) {
              throw new Error("Session is null");
            }

            const user = await prisma.user.upsert({
              where: {
                foreignId: session.user.sub,
              },
              create: {
                foreignId: session.user.sub,
              },
              update: {},
            });

            return {
              session,
              user,
              headers: {
                cookie: cookies().toString(),
                "x-trpc-source": "rsc-invoke",
              },
            };
          },
        }),
      ],
    };
  },
});
