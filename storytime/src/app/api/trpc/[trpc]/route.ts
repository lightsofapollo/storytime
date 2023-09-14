import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "../trpc-router";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "@/utils/db";

const handler = withApiAuthRequired(
  (request: any /* this works but requires hacky use of any */) => {
    console.log(`incoming request ${request.url}`);
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: async function (opts: FetchCreateContextFnOptions) {
        const session = await getSession(
          opts.req as any,
          {
            headers: opts.resHeaders,
          } as any
        )!;

        const user = await prisma.user.upsert({
          where: {
            foreignId: session!.user.sub,
          },
          create: {
            foreignId: session!.user.sub,
          },
          update: {},
        });

        return { session, user };
      } as any,
    });
  }
);

export { handler as GET, handler as POST };
