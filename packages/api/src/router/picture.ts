import { TRPCError } from "@trpc/server";
import { map } from "radash";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pictureRouter = createTRPCRouter({
  getUploadURI: protectedProcedure
    .input(
      z.object({
        age: z.enum(["OLD", "YOUNG", "CURRENT"]),
        ext: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fileName = `${ctx.session.userId}-${
        crypto.randomUUID().split("-")[0]
      }.${input.ext}`;

      // TODO: add conversion to one format

      const s3Key = `${input.age}/${fileName}`;

      const urlToUpload = await ctx.s3.createPresignedUrl(s3Key);

      await ctx.prisma.picture.create({
        data: {
          age: input.age,
          key: s3Key,
          userId: ctx.session.userId,
        },
      });

      return urlToUpload;
    }),
  getURI: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const picture = await ctx.prisma.picture.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!picture) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.s3.getPresignedUrl(picture.key);
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.picture.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const pictures = await ctx.prisma.picture.findMany({
      where: {
        userId: ctx.session.userId,
      },
    });

    return map(pictures, async (picture) => {
      const uri = await ctx.s3.getPresignedUrl(picture.key);

      return {
        ...picture,
        uri,
      };
    });
  }),
});
