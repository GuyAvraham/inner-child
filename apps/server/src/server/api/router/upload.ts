import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const uploadRoute = createTRPCRouter({
  getURL: protectedProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input: { key } }) => {
    return ctx.s3.createPresignedUrl(`${ctx.session.userId}/${key}`);
  }),
});
