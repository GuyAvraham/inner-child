import { useCallback, useMemo } from "react";
import type { PropsWithChildren } from "react";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@innch/api";
import { transformer } from "@innch/utils";

import useErrorsHandler from "~/hooks/useErrorsHandler";

export const trpc = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@innch/api";

const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost =
    Constants.manifest?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // return "https://your-production-url.com";
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:3000`;
};

export function TRPCProvider(props: PropsWithChildren) {
  const { getToken } = useAuth();
  const { handleError } = useErrorsHandler();

  const errorHandler = useCallback(
    (error: unknown) => {
      handleError((error as Error).message, error);
    },
    [handleError],
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            onError: errorHandler,
          },
          mutations: {
            onError: errorHandler,
          },
        },
      }),
    [errorHandler],
  );

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      transformer,
      links: [
        httpBatchLink({
          async headers() {
            const authToken = await getToken();

            if (!authToken) console.error("No token found");

            return {
              Authorization: authToken ?? undefined,
            };
          },
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    });
  }, [getToken]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
