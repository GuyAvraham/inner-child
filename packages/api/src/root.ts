import { photoRouter } from "./router/photo.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  photo: photoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
