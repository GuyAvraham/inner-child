import { conversationRouter } from "./router/conversation.router";
import { messageRouter } from "./router/message.router";
import { photoRouter } from "./router/photo.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  photo: photoRouter,
  message: messageRouter,
  conversation: conversationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
