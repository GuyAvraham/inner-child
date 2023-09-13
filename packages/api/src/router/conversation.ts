import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { raise } from '@innch/utils';

import { prompts } from '../prompts';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const conversationRoute = createTRPCRouter({
  get: protectedProcedure.input(z.object({ age: z.enum(['young', 'old']) })).query(async ({ ctx, input }) => {
    return ctx.db.message.findMany({
      orderBy: { createdAt: 'asc' },
      where: { conversation: { age: input.age, userId: ctx.session.userId } },
    });
  }),
  text: protectedProcedure
    .input(z.object({ message: z.string(), age: z.enum(['young', 'old']) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { age, message } = input;
        const { userId } = ctx.session;

        const conversation =
          (await ctx.db.conversation.findFirst({ where: { age, userId } })) ??
          (await ctx.db.conversation.create({ data: { age, userId } }));
        const conversationId = conversation.id;

        await ctx.db.message.create({ data: { sender: 'user', text: message.trim(), conversationId } });

        const messages = await ctx.db.message.findMany({
          where: { conversation: { age, userId } },
          orderBy: { createdAt: 'asc' },
        });

        const response = await ctx.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: prompts[age].trim(),
            },
            ...messages.map((message) => ({
              role: message.sender.toLocaleLowerCase() as 'user' | 'assistant',
              content: message.text.trim(),
            })),
          ],
        });

        return ctx.db.message.create({
          data: {
            conversationId,
            sender: 'assistant',
            // text: response.choices[0]?.message?.content ?? raise('Bad chat response'),
            text: message.trim(),
          },
        });
      } catch (error) {
        throw new TRPCError({
          message: `Problem with OpenAI request: ${String(error)}`,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  video: protectedProcedure
    .input(z.object({ text: z.string(), age: z.enum(['old', 'young']) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const photo = await ctx.db.photo.findFirst({
          where: { age: input.age, userId: ctx.session.userId },
        });

        const url = await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo?.key ?? raise('No photo found')}`);

        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
          },
          body: JSON.stringify({
            source_url: url,
            script: {
              type: 'text',
              input: input.text,
              subtitles: 'false',
              provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
              ssml: 'false',
            },
            config: { fluent: 'false', pad_audio: '0.0' },
          }),
        };

        const talk = (await (await fetch('https://api.d-id.com/talks', options)).json()) as { id: string };

        return talk.id;
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  waitForVideo: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .query(async ({ input: { predictionId } }) => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
        },
      };

      const talk = (await (await fetch(`https://api.d-id.com/talks/${predictionId}`, options)).json()) as {
        status: 'started' | 'done';
        result_url?: string;
      };

      if (talk.status !== 'done') return null;

      return talk.result_url;
    }),
  clear: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input: { id } }) => {
    return ctx.db.message.deleteMany({ where: { conversationId: id } });
  }),
});
