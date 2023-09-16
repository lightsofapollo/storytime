import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "../trpc_router";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getUser } from "@/utils/get_user";
import { NextRequest } from "next/server";

const handler = withApiAuthRequired(
  (request: any /* this works but requires hacky use of any */) => {
    console.log(`incoming request ${request.url}`);
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: async function (opts: FetchCreateContextFnOptions) {
        const { session, user } = await getUser(opts.req as NextRequest);
        return { session, user };
      } as any,
    });
  }
) as any;

export { handler as GET, handler as POST };
