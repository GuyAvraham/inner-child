import { TRPCError } from '@trpc/server';
import { parallel } from 'radash';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const photoRoute = createTRPCRouter({
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
    .input(z.object({ age: z.enum(['young', 'old']) }))
    .mutation(async ({ ctx, input: { age } }) => {
      const photo = await ctx.db.photo.findFirst({
        where: { userId: ctx.session.userId, age: 'current' },
      });

      if (!photo)
        throw new TRPCError({
          message: 'No current photo found',
          code: 'NOT_FOUND',
        });

      const photoURL = await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`);

      return ctx.replicate.predictions.create({
        version: '9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c',
        input: {
          image: photoURL,
          target_age: { young: '0', old: '80' }[age],
        },
      });
    }),
  wait: protectedProcedure
    .input(z.object({ predictionId: z.string() }))
    .query(async ({ ctx, input: { predictionId } }) => {
      const prediction = await ctx.replicate.predictions.get(predictionId);

      if (prediction.status !== 'succeeded') return null;

      return prediction.output as string;
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

    await ctx.s3.deleteFiles(photos.map((photo) => photo.key));

    return ctx.db.photo.deleteMany({
      where: { id: { in: photos.map((photo) => photo.id) } },
    });
  }),
});
