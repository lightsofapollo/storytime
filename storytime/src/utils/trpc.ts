import type { AppRouter } from "@/app/api/trpc/trpc_router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
