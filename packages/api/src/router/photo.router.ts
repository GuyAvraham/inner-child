import { parallel } from "radash";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ageMap } from "../utils/ageMap";
import { replicate } from "../utils/replicate";

export const photoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        age: z.enum(["YOUNG", "CURRENT", "OLD"]),
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { age, key } }) => {
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
        photoURL: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const generatedPhotoURL = await replicate.run(
        "yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
        {
          input: {
            image: input.photoURL,
            target_age: ageMap[input.age],
          },
        },
      );

      return generatedPhotoURL;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.photo.findMany();

    return parallel(2, photos, async (photo) => ({
      ...photo,
      uri: await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`),
    }));
  }),
});
