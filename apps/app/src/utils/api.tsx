import type { PropsWithChildren } from 'react';
import { useCallback, useMemo } from 'react';
import Constants from 'expo-constants';
import { useAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

import type { AppRouter } from '@innch/api';
import { raise } from '@innch/utils';

import useErrorHandler from '~/hooks/useErrorHandler';

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from '@innch/api';

export const getBaseUrl = () => {
  return (
    process.env.EXPO_PUBLIC_API_URL ?? raise('No EXPO_PUBLIC_API_URL found')
  );
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0];

  if (!localhost)
    return (
      process.env.EXPO_PUBLIC_API_URL ?? raise('No EXPO_PUBLIC_API_URL found')
    );

  return `http://${localhost}:3000`;
};

export function TRPCProvider(props: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();
  const { handleError } = useErrorHandler();

  const onError = useCallback(
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
            onError,
          },
          mutations: {
            onError,
          },
        },
      }),
    [onError],
  );
  const trpcClient = useMemo(
    () =>
      api.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            async headers() {
              const authToken = await getToken();

              const headers = new Map<string, string>();

              headers.set('x-trpc-source', 'expo-react');
              if (isSignedIn)
                headers.set(
                  'Authorization',
                  authToken ?? raise('No auth token'),
                );

              return Object.fromEntries(headers);
            },
          }),
        ],
      }),
    [getToken, isSignedIn],
  );

  return (
    <api.Provider
      client={trpcClient}
      queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
