import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Slot, usePathname, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/clerk-expo";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/tokenCache";
import DEV_ResetProfile from "~/components/DEV_ResetProfile";
import ProtectedProvider from "~/auth/ProtectedProvider";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  console.log({ pathname, segments });

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublicKey as string}
    >
      <TRPCProvider>
        <SafeAreaProvider>
          <SafeAreaView>
            <ClerkLoaded>
              <ProtectedProvider>
                <DEV_ResetProfile />
                <Slot />
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

// TODO:
// 1. add point to ask about gender to match the voice
// 2. find a way to speed up video generation cuz it soooo slow
