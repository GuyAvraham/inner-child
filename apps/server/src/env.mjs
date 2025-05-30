import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3000),
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_DATABASE_URL: z.string().url(),
    REPLICATE_API_TOKEN: z.string(),
    OPENAI_API_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    DID_API_KEY: z.string(),
    DID_API_TOKEN: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_SERVER_MODE: z
      .string()
      .optional(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_MODE: process.env.NEXT_PUBLIC_SERVER_MODE,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DID_API_KEY: process.env.DID_API_KEY,
    DID_API_TOKEN: process.env.DID_API_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
