import type { ExpoConfig } from '@expo/config';

const defineConfig = (): ExpoConfig => ({
  name: 'Tamagochi Inner Child',
  slug: 'tamagochi-inner-child',
  scheme: 'tamagochi-inner-child',
  version: '1.0.0',
  owner: 'inner-child',
  orientation: 'portrait',
  icon: './assets/inner-child-logo.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: 'rgb(66,133,244)',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/b0cd7774-1f25-4469-a2ed-21ae8e40206f',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tamagochi.inner.child.app',
  },
  android: {
    package: 'com.tamagochi.inner.child.app',
    adaptiveIcon: {
      foregroundImage: './assets/inner-child-logo.png',
      backgroundColor: 'rgb(66,133,244)',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: 'b0cd7774-1f25-4469-a2ed-21ae8e40206f',
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
      },
    ],
    './expo-plugins/with-modify-gradle.js',
  ],
});

export default defineConfig;
