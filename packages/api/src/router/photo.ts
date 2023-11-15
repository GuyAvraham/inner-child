import { TRPCError } from '@trpc/server';
import { parallel } from 'radash';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const photoRoute = createTRPCRouter({
  getPhotosFromGame: protectedProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ input: { email } }) => {
      if (!email) return { error: 'No email' };

      try {
        const url = process.env.GUESS_THE_NAME_GAME_URL;
        if (!url) return { error: 'No game url' };
        const xApiKey = process.env.GUESS_THE_NAME_X_API_KEY;
        if (!xApiKey) return { error: 'No game x api key' };
        const res = await fetch(`${url}/api/get-photos?email=${email}`, {
          headers: {
            'x-api-key': xApiKey,
          },
        });
        return (await res.json()) as { photos?: string[]; error: string | null };
      } catch (error) {
        return { error: String(error) };
      }
    }),
  create: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'current', 'old']), key: z.string() }))
    .mutation(async ({ ctx, input: { age, key } }) => {
      const createdPhoto = await ctx.db.photo.create({
        data: { age, key, userId: ctx.session.userId },
      });

      return {
        ...createdPhoto,
        uri: await ctx.s3.getPresignedUrl(key),
      };
    }),
  generateAged: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'old']), gender: z.enum(['male', 'female']) }))
    .mutation(async ({ ctx, input: { age, gender } }) => {
      const photo = await ctx.db.photo.findFirst({
        where: { userId: ctx.session.userId, age: 'current' },
      });

      if (!photo)
        throw new TRPCError({
          message: 'No current photo found',
          code: 'NOT_FOUND',
        });

      const photoURL = await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`);

      // MODELS of generation photos
      return Promise.allSettled([
        ctx.replicate.predictions.create({
          version: '9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c',
          input: {
            image: photoURL,
            target_age: { young: '0', old: '80' }[age],
          },
        }),
        ctx.replicate.predictions.create({
          // deliberate v3
          version: '1851b62340ae657f05f8b8c8a020e3f9a46efde9fe80f273eef026c0003252ac',
          input: {
            image: photoURL,
            prompt: `${gender}, ${age === 'old' ? '70' : '5'} years old, ${
              age === 'young' ? 'child' : '((gray hair:1.5))'
            }, photo`,
            negative_prompt: `${
              age === 'young' ? '(beard, mustache, whisker:1.3),' : ''
            } [deformed | disfigured], poorly drawn, [bad : wrong] anatomy, [extra | missing | floating | disconnected] limb, (mutated hands and fingers), blurry`,
            prompt_strength: 0.5,
          },
        }),
        ctx.replicate.predictions.create({
          // mixinmax1990/realisitic-vision-v3-image-to-image
          version: '6eb633a82ab3e7a4417d0af2e84e24b4b419c76f86f6e837824d02ae6845dc81',
          input: {
            image: photoURL,
            prompt: `${gender}, ${age === 'old' ? '70' : '5'} years old, ${
              age === 'young' ? 'child' : '((gray hair:1.5))'
            }, photo`,
            negative_prompt: `${
              age === 'young' ? '(beard, mustache, whisker:1.3),' : ''
            } [deformed | disfigured], poorly drawn, [bad : wrong] anatomy, [extra | missing | floating | disconnected] limb, (mutated hands and fingers), blurry`,
            prompt_strength: 0.5,
          },
        }),
        ctx.replicate.predictions.create({
          version: '02d575aeefff93cc32262e65c2784e00bf1af37071a6b6202adf62285c71f559',
          input: {
            image: photoURL,
            prompt: `${gender}, ${age === 'old' ? '70' : '5'} years old, ${
              age === 'young' ? 'child' : '((gray hair:1.5))'
            }, photo`,
            negative_prompt: `${
              age === 'young' ? '(beard, mustache, whisker:1.3),' : ''
            } [deformed | disfigured], poorly drawn, [bad : wrong] anatomy, [extra | missing | floating | disconnected] limb, (mutated hands and fingers), blurry`,
            prompt_strength: 0.5,
          },
        }),
      ]);
    }),
  wait: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .mutation(async ({ ctx, input: { predictionId } }) => {
      const prediction = await ctx.replicate.predictions.get(predictionId);

      console.log(prediction);

      if (prediction.status === 'failed') return 500;

      if (prediction.status !== 'succeeded') return null;

      if (Array.isArray(prediction.output) && typeof prediction.output[0] === 'string') {
        return prediction.output[0];
      }

      if (typeof prediction.output === 'string') {
        return prediction.output;
      }

      return null;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.photo.findMany({
      where: {
        userId: ctx.session.userId,
      },
    });

    return parallel(3, photos, async (photo) => ({
      ...photo,
      uri: await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`),
    }));
  }),
  getByAge: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'current', 'old']) }))
    .query(async ({ ctx, input: { age } }) => {
      const photo = await ctx.db.photo.findFirst({
        where: { age, userId: ctx.session.userId },
      });

      if (!photo) return null;

      return {
        ...photo,
        uri: await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`),
      };
    }),
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const photos = await ctx.db.photo.findMany({
      where: { userId: ctx.session.userId },
    });
    const videos = await ctx.db.video.findMany({
      where: { userId: ctx.session.userId },
    });

    const s3Keys = [...photos, ...videos].map((item) => `${ctx.session.userId}/${item.key}`);
    await ctx.s3.deleteFiles(s3Keys);

    return Promise.allSettled([
      ctx.db.photo.deleteMany({
        where: { id: { in: photos.map((photo) => photo.id) } },
      }),
      ctx.db.video.deleteMany({
        where: { id: { in: videos.map((video) => video.id) } },
      }),
    ]);
  }),
});
