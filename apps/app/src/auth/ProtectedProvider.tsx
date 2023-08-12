import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Provider } from "jotai";

import { ROUTE } from "~/config/routes";

const useProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && isLoaded) {
      if (inAuthGroup) router.replace(ROUTE.ROOT);
    } else {
      router.replace(ROUTE.LOGIN);
    }
  }, [isLoaded, isSignedIn, router, segments]);

  return {
    showLoader: !isLoaded,
  };
};

export default function ProtectedProvider({ children }: PropsWithChildren) {
  const { showLoader } = useProtectedRoute();
  const { user } = useUser();

  return showLoader ? (
    // TODO: replace with proper loader
    <>
      <Text>Loading...</Text>
    </>
  ) : (
    <Provider key={user?.id}>{children}</Provider>
  );
}
