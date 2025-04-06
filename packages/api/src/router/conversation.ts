import { TRPCError } from '@trpc/server';
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
  getPrompts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.contentful.getPrompts();
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
        body: JSON.stringify({ model: 'gpt-4-1106-preview', messages: input }),
      });
      const json = (await response.json()) as OpenAIResponse;

      return json.choices?.[0]?.message?.content ?? null;
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
    .input(z.object({ text: z.string(), age: z.enum(['old', 'young']), gender: z.enum(['male', 'female']) }))
    .mutation(async ({ ctx, input: { text, age, gender } }) => {
      try {
        const photo = await ctx.db.photo.findFirst({
          where: { age, userId: ctx.session.userId },
        });

        const url = await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo?.key ?? raise('No photo found')}`);

        // voice gallery: https://speech.microsoft.com/portal/voicegallery
        const voices = {
          male: {
            young: 'en-US-AnaNeural',
            old: 'en-US-DavisNeural',
          },
          female: {
            young: 'en-US-AnaNeural',
            old: 'en-US-CoraNeural',
          },
        };

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
              input: text,
              subtitles: 'false',
              provider: { type: 'microsoft', voice_id: voices[gender][age] },
              ssml: 'false',
            },
            config: { fluent: 'false', pad_audio: '0.0' },
          }),
        };

        const talk = (await (await fetch('https://api.d-id.com/talks', options)).json()) as {
          id?: string;
          kind: string;
          description: string;
        };

        if (!talk.id) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `${talk.kind}: ${talk.description}`,
          });
        }

        return talk.id;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new TRPCError(error);
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

  createStream: protectedProcedure
    .input(z.object({ age: z.enum(['old', 'young']), gender: z.enum(['male', 'female']) }))
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
            'Content-Type': 'application/json',
            authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
          },
          body: JSON.stringify({
            source_url: url,
          }),
        };
        const sessionResponse = (await (await fetch(`https://api.d-id.com/talks/streams`, options)).json()) as {
          id: string;
          session_id: string;
          offer: string;
          ice_servers: [
            {
              urls: string[];
            },
          ];
        };

        return sessionResponse;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new TRPCError(error);
      }
    }),

  sdpResponse: protectedProcedure
    .input(z.object({ sessionId: z.string(), streamId: z.string(), answer: z.custom<RTCSessionDescriptionInit>() }))
    .mutation(async ({ input: { sessionId, streamId, answer } }) => {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
        },
        body: JSON.stringify({
          answer,
          session_id: sessionId,
        }),
      };

      const sdpResponse = (await (
        await fetch(`https://api.d-id.com/talks/streams/${streamId}/sdp`, options)
      ).json()) as {
        id: string;
        status: string;
      };

      return sdpResponse;
    }),

  onIceCandidate: protectedProcedure
    .input(z.object({ sessionId: z.string().nullable(), event: z.custom<RTCPeerConnectionIceEvent>() }))
    .mutation(async ({ input: { sessionId, event } }) => {
      if (event.candidate && sessionId) {
        const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
        const options = {
          method: 'POST',
          headers: {
            authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidate,
            sdpMid,
            sdpMLineIndex,
            session_id: sessionId,
          }),
        };

        return (await (await fetch(`https://api.d-id.com/talks/streams/${streamId}/ice`, options)).json()) as unknown;
      }
    }),

  sendMessageToVideoStream: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        streamId: z.string(),
        message: z.string(),
        age: z.enum(['old', 'young']),
        gender: z.enum(['male', 'female']),
      }),
    )
    .mutation(async ({ input: { sessionId, streamId, message, age, gender } }) => {
      // voice gallery: https://speech.microsoft.com/portal/voicegallery
      const voices = {
        male: {
          young: 'en-US-AnaNeural',
          old: 'en-US-DavisNeural',
        },
        female: {
          young: 'en-US-AnaNeural',
          old: 'en-US-CoraNeural',
        },
      };

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          script: {
            type: 'text',
            input: message,
            subtitles: 'false',
            provider: { type: 'microsoft', voice_id: voices[gender][age] },
            ssml: false,
          },
          config: { fluent: 'false', pad_audio: '0.0' },
        }),
      };

      return (await (await fetch(`https://api.d-id.com/talks/streams/${streamId}`, options)).json()) as {
        status: string; //'started' | 'done';
        session_id: string;
      };
    }),

  closeStream: protectedProcedure
    .input(z.object({ streamId: z.string(), sessionId: z.string() }))
    .mutation(async ({ input: { streamId, sessionId } }) => {
      return (await (
        await fetch(`https://api.d-id.com/talks/streams/${streamId}`, {
          method: 'DELETE',
          headers: {
            authorization: `Basic ${process.env.DID_API_TOKEN ?? raise('No DID_API_TOKEN env var')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        })
      ).json()) as unknown;
    }),
});
