import { photoRouter } from "./router/photo.router";
import { uploadRoute } from "./router/upload.route";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  upload: uploadRoute,
  photo: photoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
