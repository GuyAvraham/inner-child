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
  video: protectedProcedure
    .input(z.object({ text: z.string(), age: z.enum(["OLD", "YOUNG"]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const photo = await ctx.db.photo.findFirst({
          where: {
            age: input.age,
            userId: ctx.session.userId,
          },
        });

        const url = await ctx.s3.getPresignedUrl(
          `${ctx.session.userId}/${photo?.key ?? raise("No photo found")}`,
        );

        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            authorization:
              "Basic Ym9nZGFuQGd1eS1hdnJhaGFtLmNvbQ:y-dAsLP59JUwdAaB0wHgY",
          },
          body: JSON.stringify({
            source_url: url,
            script: {
              type: "text",
              input: input.text,
              subtitles: "false",
              provider: { type: "microsoft", voice_id: "en-US-JennyNeural" },
              ssml: "false",
            },
            config: { fluent: "false", pad_audio: "0.0" },
          }),
        };

        const talk = (await (
          await fetch("https://api.d-id.com/talks", options)
        ).json()) as { id: string };

        return talk.id;
      } catch (error) {
        console.log(error);
        return null;
      }
    }),
  waitForVideo: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .query(async ({ input: { predictionId } }) => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization:
            "Basic Ym9nZGFuQGd1eS1hdnJhaGFtLmNvbQ:y-dAsLP59JUwdAaB0wHgY",
        },
      };

      const talk = (await (
        await fetch(`https://api.d-id.com/talks/${predictionId}`, options)
      ).json()) as {
        status: "started" | "done";
        result_url?: string;
      };

      if (talk.status !== "done") return null;

      return talk.result_url;
    }),
  clear: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.db.message.deleteMany({
        where: {
          conversationId: id,
        },
      });
    }),
});
