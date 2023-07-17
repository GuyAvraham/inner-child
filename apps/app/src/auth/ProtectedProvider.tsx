import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { ROUTE } from "~/config/routes";

const useProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && isLoaded) {
      router.replace(ROUTE.ROOT);
    } else {
      router.replace(ROUTE.LOGIN);
    }
  }, [isLoaded, isSignedIn, router]);

  return {
    showLoader: !isLoaded,
  };
};

export default function ProtectedProvider({ children }: PropsWithChildren) {
  const { showLoader } = useProtectedRoute();

  return showLoader ? (
    // TODO: replace with proper loader
    <>
      <Text>Loading...</Text>
    </>
  ) : (
    <>{children}</>
  );
}
