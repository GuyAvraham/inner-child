import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  send: protectedProcedure
    .input(
      z.object({
        role: z.enum(["ASSISTANT", "USER"]),
        content: z.string(),
        conversationId: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.create({
        data: {
          content: input.content,
          role: input.role,
          conversationId: input.conversationId
        }
      });

      return message;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!message) throw new TRPCError({ code: "NOT_FOUND" });

      return message;
    }),
  getAll: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
      });
      
      if (!messages) throw new TRPCError({ code: "NOT_FOUND" });

      return messages;
    }),
});