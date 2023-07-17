import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/tokenCache";
import ProtectedProvider from "~/auth/ProtectedProvider";

export { ErrorBoundary } from "expo-router";

const RootLayout = () => {
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
};

export default RootLayout;
