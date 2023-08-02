import { z } from "zod";

import { MessageSender } from "@innch/db";
import { raise } from "@innch/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationRoute = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ age: z.enum(["YOUNG", "OLD"]) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          conversation: {
            age: input.age,
            userId: ctx.session.userId,
          },
        },
      });
    }),
  talk: protectedProcedure
    .input(z.object({ message: z.string(), age: z.enum(["YOUNG", "OLD"]) }))
    .mutation(async ({ ctx, input }) => {
      let conversation = await ctx.db.conversation.findFirst({
        where: {
          userId: ctx.session.userId,
          age: input.age,
        },
      });

      if (!conversation)
        conversation = await ctx.db.conversation.create({
          data: {
            age: input.age,
            userId: ctx.session.userId,
          },
        });

      await ctx.db.message.create({
        data: {
          sender: MessageSender.USER,
          text: input.message,
          conversationId: conversation.id,
        },
      });

      const messages = await ctx.db.message.findMany({
        where: {
          conversation: {
            age: input.age,
            userId: ctx.session.userId,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const response = await ctx.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages.map((message) => ({
          role: message.sender.toLocaleLowerCase() as "user" | "assistant",
          content: message.text,
        })),
      });

      return ctx.db.message.create({
        data: {
          conversationId: conversation.id,
          sender: MessageSender.ASSISTANT,
          text:
            response.data.choices[0]?.message?.content ??
            raise("Bad chat response"),
        },
      });
    }),
});
