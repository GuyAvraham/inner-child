/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ImageBackground } from 'expo-image';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';

import { raise } from '@innch/utils';

import { TRPCProvider } from '~/utils/api';
import tokenCache from '~/utils/tokenCache';
import DEV from '~/components/DEV';
import ProtectedProvider from '~/auth/ProtectedProvider';
import { isIos } from '~/config/variables';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontsError] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Bold-Italic': require('../assets/fonts/Poppins-BoldItalic.ttf'),
  });

  if (!fontsLoaded && !fontsError) return null;

  return (
    <ClerkProvider
      publishableKey={
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? raise('No EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY found')
      }
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <ProtectedProvider>
          <SafeAreaProvider>
            <ImageBackground source={require('../assets/bg1.png')} style={{ flex: 1 }}>
              <PortalProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <DEV />
                  <View className={`${isIos ? '-mt-9' : '-mt-10'} flex-1`}>
                    <Slot />
                  </View>
                </SafeAreaView>
              </PortalProvider>
            </ImageBackground>
          </SafeAreaProvider>
          <StatusBar style="light" />
        </ProtectedProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
