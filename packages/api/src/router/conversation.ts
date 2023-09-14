import { z } from 'zod';

import { raise } from '@innch/utils';

import type { OpenAIResponse } from '../openai';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const conversationRoute = createTRPCRouter({
  get: protectedProcedure.input(z.object({ age: z.enum(['young', 'old']) })).query(async ({ ctx, input }) => {
    return ctx.db.message.findMany({
      orderBy: { createdAt: 'asc' },
      where: { conversation: { age: input.age, userId: ctx.session.userId } },
    });
  }),
  sendMessageToOpenAI: protectedProcedure
    .input(z.array(z.object({ content: z.string(), role: z.enum(['user', 'assistant', 'system']) })))
    .mutation(async ({ input }) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: input }),
      });
      const json = (await response.json()) as OpenAIResponse;

      return json.choices[0]?.message?.content ?? null;
    }),
  saveMessage: protectedProcedure
    .input(z.object({ message: z.string(), age: z.enum(['young', 'old']), sender: z.enum(['user', 'assistant']) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session;
      const { age, sender, message } = input;
      const text = message.trim();

      const conversation =
        (await ctx.db.conversation.findFirst({ where: { age, userId } })) ??
        (await ctx.db.conversation.create({ data: { age, userId } }));
      const conversationId = conversation.id;

      return await ctx.db.message.create({ data: { sender, text, conversationId } });
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
