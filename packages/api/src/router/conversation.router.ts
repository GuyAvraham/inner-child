import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
        z.object({
            targetAge: z.enum(["OLD", "YOUNG", "CURRENT"])
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.create({
      data: {
        targetAge: input.targetAge,
        userId: ctx.session.userId
      });

      return conversation;
    }),
  get: protectedProcedure
    .input(z.object({ targetAge: z.enum(["OLD", "YOUNG", "CURRENT"]) }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: {
          targetAge: input.targetAge,
          userId:  ctx.session.userId
        },
      });
      
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });

      return conversation;
    }),
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const conversations = await ctx.db.conversation.findMany({
        where: {
          userId: ctx.session.userId
        }
      });

      if (!conversations) throw new TRPCError({ code: "NOT_FOUND" });

      return conversations;
    }),
});