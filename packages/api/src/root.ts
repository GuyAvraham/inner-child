import { conversationRoute } from './router/conversation';
import { photoRoute } from './router/photo';
import { uploadRoute } from './router/upload';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  conversation: conversationRoute,
  photo: photoRoute,
  upload: uploadRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
