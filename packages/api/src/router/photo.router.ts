import { parallel } from "radash";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        age: z.enum(["YOUNG", "CURRENT", "OLD"]),
        photoURI: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { age, photoURI } }) => {
      const key = `${ctx.session.userId}/${age}-${
        crypto.randomUUID().split("-")[0]
      }.jpeg`;

      const photoBlob = await (await fetch(photoURI)).blob();

      await ctx.s3.uploadFile(key, Buffer.from(await photoBlob.arrayBuffer()));

      return {
        ...(await ctx.db.photo.create({
          data: {
            age,
            key,
            userId: ctx.session.userId,
          },
        })),
        uri: await ctx.s3.getPresignedUrl(key),
      };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.photo.findMany();

    return parallel(2, photos, async (photo) => ({
      ...photo,
      uri: await ctx.s3.getPresignedUrl(photo.key),
    }));
  }),
});
