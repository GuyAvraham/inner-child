import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter, createTRPCContext } from "@acme/api";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
