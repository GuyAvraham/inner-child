import { conversationRoute } from './router/conversation';
import { photoRoute } from './router/photo';
import { uploadRoute } from './router/upload';
import { videoRoute } from './router/video';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  conversation: conversationRoute,
  photo: photoRoute,
  video: videoRoute,
  upload: uploadRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
