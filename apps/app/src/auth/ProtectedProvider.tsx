import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Provider } from 'jotai';

import { ROUTES } from '~/config/routes';
import useUserData from '~/hooks/useUserData';

const useProtectedRoute = () => {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { data } = useUserData();
  const { user } = useUser();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!isSignedIn) return router.replace(ROUTES.AUTH.INDEX);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (data && !data.gender) return router.replace(ROUTES.AUTH.GENDER);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (inAuthGroup) return router.replace(ROUTES.INDEX);
  }, [data, isAuthLoaded, isSignedIn, router, segments, user]);
};

export default function ProtectedProvider({ children }: PropsWithChildren) {
  const { data, user } = useUserData();
  useProtectedRoute();

  return (
    <Provider key={(data?.token as string | undefined) ?? user?.id}>
      {children}
    </Provider>
  );
}
