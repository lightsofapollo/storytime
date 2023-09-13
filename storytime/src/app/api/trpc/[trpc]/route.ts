import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "../trpc-router";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

const handler = withApiAuthRequired(
  (request: any /* this works but requires hacky use of any */) => {
    console.log(`incoming request ${request.url}`);
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: function (
        opts: FetchCreateContextFnOptions
      ): object | Promise<object> {
        return {};
      },
    });
  }
);

export { handler as GET, handler as POST };
