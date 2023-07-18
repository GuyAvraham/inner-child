import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pictureRouter = createTRPCRouter({
  createS3UploadLink: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fileName = `picture-${Date.now()}.${input.fileName
        .split(".")
        .at(-1)}`;
      const urlToUpload = await ctx.s3.createPresignedUrl(fileName);

      const urlToSave = await ctx.s3.getUrlForDb(fileName);

      return { urlToUpload, urlToSave };
    }),
  saveMetadata: protectedProcedure
    .input(
      z.object({
        age: z.enum(["OLD", "YOUNG", "CURRENT"]),
        s3URI: z.string().url(),
      }),
    )
    .mutation(({ ctx, input: { age, s3URI } }) => {
      return ctx.prisma.picture.create({
        data: {
          age,
          uri: s3URI,
          userId: ctx.session.userId,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.picture.findMany({
      where: {
        userId: ctx.session.userId,
      },
    });
  }),
});
