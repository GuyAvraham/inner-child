import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';

import { raise } from '@innch/utils';

import { TRPCProvider } from '~/utils/api';
import tokenCache from '~/utils/tokenCache';
import DEV from '~/components/DEV';
import ProtectedProvider from '~/auth/ProtectedProvider';
import { isIos } from '~/config/variables';

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
        raise('No EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY found')
      }
      tokenCache={tokenCache}>
      <TRPCProvider>
        <ProtectedProvider>
          <SafeAreaProvider>
            <PortalProvider>
              <SafeAreaView className="flex-1">
                <DEV />
                <View className={`${isIos ? '-mt-9' : '-mt-10'} flex-1`}>
                  <Slot />
                </View>
              </SafeAreaView>
            </PortalProvider>
          </SafeAreaProvider>
          <StatusBar />
        </ProtectedProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
