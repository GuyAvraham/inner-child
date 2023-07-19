import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Slot, usePathname, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/tokenCache";
import ProtectedProvider from "~/auth/ProtectedProvider";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  console.log({ pathname, segments });

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={
        Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY as string
      }
    >
      <TRPCProvider>
        <SafeAreaProvider>
          <SafeAreaView>
            <ProtectedProvider>
              <Slot />
            </ProtectedProvider>
          </SafeAreaView>
          <StatusBar />
        </SafeAreaProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
