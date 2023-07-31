import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const conversationRouter = createTRPCRouter({
  getNew: protectedProcedure
    .input(
        z.object({
            targetAge: z.enum(["OLD", "YOUNG", "CURRENT"]),
            messages: z.array(z.object({
                role: z.enum(["ASSISTANT", "USER"]),
                content: z.string(),
                conversationId: z.string()
            }))
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const message = await ctx.db.conversation.create({
        data: {
            targetAge: input.targetAge,
            messages: input.messages,
        }
        });

    return message;
  }),
  get: protectedProcedure
    .input(z.object({ targetAge: z.enum(["OLD", "YOUNG", "CURRENT"]) }))
    .query(async ({ ctx, input }) => {
      const message = await ctx.db.conversation.findUnique({
        where: {
          targetAge: input.targetAge,
        },
      });
      
      if (!message) throw new TRPCError({ code: "NOT_FOUND" });

      return message;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const messages = await ctx.db.message.findMany();

    if (!messages) throw new TRPCError({ code: "NOT_FOUND" });

    return messages;
  }),
});