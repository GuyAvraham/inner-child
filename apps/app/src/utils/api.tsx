import { useCallback, useMemo } from "react";
import type { PropsWithChildren } from "react";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@innch/api";
import { transformer } from "@innch/utils";

import useErrorsHandler from "~/hooks/useErrorsHandler";

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@innch/api";

const getApiUrl = () => Constants?.expoConfig?.extra?.apiUrl as string;

export function TRPCProvider(props: PropsWithChildren) {
  const { getToken } = useAuth();
  const { handleError } = useErrorsHandler();

  const errorHandler = useCallback(
    (error: unknown) => {
      handleError(error);
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
    return api.createClient({
      transformer,
      links: [
        httpLink({
          async headers() {
            const authToken = await getToken();

            if (!authToken) handleError(new Error("No auth token found"));

            return {
              Authorization: authToken ?? undefined,
            };
          },
          url: `${getApiUrl()}/api/trpc`,
        }),
      ],
    });
  }, [getToken, handleError]);

  return (
    <api.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
