import { pictureRouter } from "./router/picture";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  picture: pictureRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
