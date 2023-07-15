import { ClerkProvider } from "@clerk/nextjs";

import "../styles/globals.css";

import type { AppType } from "next/app";

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
