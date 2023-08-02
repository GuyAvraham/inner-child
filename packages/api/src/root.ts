import { photoRoute } from "./router/photo.route";
import { uploadRoute } from "./router/upload.route";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  upload: uploadRoute,
  photo: photoRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
