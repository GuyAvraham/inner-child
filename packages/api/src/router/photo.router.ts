import { parallel } from "radash";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ageMap } from "../utils/ageMap";
import { replicate } from "../utils/replicate";

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
  generateAged: protectedProcedure
    .input(
      z.object({
        age: z.enum(["YOUNG", "OLD"]),
        photoURI: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generatedPhotoURL = await replicate.run(
        "yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
        {
          input: {
            image: input.photoURI,
            target_age: ageMap[input.age],
          },
        },
      );

      const photo = Buffer.from(
        await (
          await (await fetch(generatedPhotoURL as unknown as string)).blob()
        ).arrayBuffer(),
      );

      const key = `${ctx.session.userId}/${input.age}-${
        crypto.randomUUID().split("-")[0]
      }.png`;

      await ctx.s3.uploadFile(key, photo);

      return {
        ...(await ctx.db.photo.create({
          data: {
            age: input.age,
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
