// Importing env files here to validate on build
import './src/env.mjs';
import '@innch/auth/env.mjs';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@innch/api', '@innch/auth', '@innch/db'],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
