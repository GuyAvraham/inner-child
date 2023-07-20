import { useCallback, useMemo } from "react";
import type { PropsWithChildren } from "react";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@innch/api";
import { transformer } from "@innch/utils";

import { API_URL } from "~/config/consts";
import useErrorsHandler from "~/hooks/useErrorsHandler";

export const trpc = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@innch/api";

const getApiUrl = () =>
  (Constants?.expoConfig?.extra?.apiUrl as string | undefined) ?? API_URL;

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
          url: `${getApiUrl()}/api/trpc`,
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
