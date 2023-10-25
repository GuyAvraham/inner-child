import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const videoRoute = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'old']), key: z.string() }))
    .mutation(async ({ ctx, input: { age, key } }) => {
      const createdVideo = await ctx.db.video.create({
        data: { age, key, userId: ctx.session.userId },
      });

      return {
        ...createdVideo,
        uri: await ctx.s3.getPresignedUrl(key),
      };
    }),
  getByAge: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'old']) }))
    .query(async ({ ctx, input: { age } }) => {
      const video = await ctx.db.video.findFirst({
        where: { age, userId: ctx.session.userId },
      });

      if (!video) return null;

      return {
        ...video,
        uri: await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${video.key}`),
      };
    }),
  deleteByAge: protectedProcedure
    .input(z.object({ age: z.enum(['young', 'old']) }))
    .mutation(async ({ ctx, input: { age } }) => {
      const video = await ctx.db.video.findFirst({
        where: { age, userId: ctx.session.userId },
      });

      if (!video) return null;

      const s3Key = `${ctx.session.userId}/${video.key}`;
      await ctx.s3.deleteFiles([s3Key]);

      return ctx.db.video.delete({ where: { id: video.id } });
    }),
});
