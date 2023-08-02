import { conversationRoute } from "./router/conversation.route";
import { photoRoute } from "./router/photo.route";
import { uploadRoute } from "./router/upload.route";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  upload: uploadRoute,
  photo: photoRoute,
  conversation: conversationRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
