import { Text } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Slot, usePathname, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/clerk-expo";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/tokenCache";
import ProtectedProvider from "~/auth/ProtectedProvider";
import { CLERK_PUBLIC_KEY } from "~/config/consts";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  console.log({ pathname, segments });

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={
        (Constants.expoConfig?.extra?.clerkPublicKey as string | undefined) ??
        CLERK_PUBLIC_KEY
      }
    >
      <TRPCProvider>
        <SafeAreaProvider>
          <SafeAreaView>
            <ClerkLoaded>
              <ProtectedProvider>
                <RootSiblingParent>
                  <Slot />
                </RootSiblingParent>
              </ProtectedProvider>
            </ClerkLoaded>
            <ClerkLoading>
              <Text>Loading ...</Text>
              {/* TODO: show splash screen */}
            </ClerkLoading>
          </SafeAreaView>
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
