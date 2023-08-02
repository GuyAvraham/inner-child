import { TRPCError } from "@trpc/server";
import { parallel } from "radash";
import { z } from "zod";

import { AgeMode } from "@innch/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ageMap } from "../utils/ageMap";
import { replicate } from "../utils/replicate";

export const photoRoute = createTRPCRouter({
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findFirst({
        where: {
          userId: ctx.session.userId,
          age: AgeMode.CURRENT,
        },
      });

      if (!photo)
        throw new TRPCError({
          message: "No current photo found",
          code: "NOT_FOUND",
        });

      const photoURL = await ctx.s3.getPresignedUrl(
        `${ctx.session.userId}/${photo.key}`,
      );

      const generatedPhotoURL = await replicate.run(
        "yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
        {
          input: {
            image: photoURL,
            target_age: ageMap[input.age],
          },
        },
      );

      return generatedPhotoURL as unknown as string;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.db.photo.findMany();

    return parallel(2, photos, async (photo) => ({
      ...photo,
      uri: await ctx.s3.getPresignedUrl(`${ctx.session.userId}/${photo.key}`),
    }));
  }),
});
