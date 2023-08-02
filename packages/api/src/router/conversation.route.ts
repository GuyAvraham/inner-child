import { z } from "zod";

import { MessageSender } from "@innch/db";
import { raise } from "@innch/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { replicate } from "../utils/replicate";

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
  text: protectedProcedure
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
  voice: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return (
        await fetch(
          `http://api.voicerss.org/?key=cd6f3357f8ea4454bd2b182f8611a40e&hl=en-us&c=mp3&f=32khz_16bit_stereo&src=${input.text}&b64=true`,
          {
            method: "POST",
          },
        )
      ).text();
    }),
  video: protectedProcedure
    .input(z.object({ voice: z.string(), image: z.string() }))
    .mutation(async ({ input }) => {
      const videoURL = await replicate.run(
        "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
        {
          input: {
            source_image: input.image,
            driven_audio: input.voice,
          },
        },
      );

      return videoURL as unknown as string;
    }),
});
