import type { NextRequest } from 'next/server';
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from '@clerk/nextjs/api';
import { getAuth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { db } from '@innch/db';

import { openai } from './openai';
import { replicate } from './replicate';
import { s3 } from './s3';

interface CreateContextOptions {
  session: SignedInAuthObject | SignedOutAuthObject | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
    openai,
    replicate,
    s3,
  };
};

export const createTRPCContext = (opts: { req: NextRequest }) => {
  const session = getAuth(opts.req);
  const source = opts.req.headers.get('x-trpc-source') ?? 'unknown';

  console.log('>>> tRPC Request from', source, 'by', session?.userId);

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const enforceUserIsAuthorized = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthorized);
