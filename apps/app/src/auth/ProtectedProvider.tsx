import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { ROUTE } from "~/config/routes";
import { api } from "~/utils/api";

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
  const { isSignedIn } = useAuth();
  const { mutateAsync: createConversation } = api.conversation.create.useMutation();
  const { data: conversations, isLoading } = api.conversation.getAll.useQuery();

  useEffect(() => {
    if (isLoading) return;

    if(isSignedIn) {
      
      if(conversations?.length === 0) {
        void createConversation({ targetAge: "OLD"});
        void createConversation({ targetAge: "YOUNG"});
      }
    }
  }, [conversations?.length, createConversation, isLoading, isSignedIn])

  return showLoader ? (
    // TODO: replace with proper loader
    <>
      <Text>Loading...</Text>
    </>
  ) : (
    <>{children}</>
  );
}
