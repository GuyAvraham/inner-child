import type { ExpoConfig } from '@expo/config';

const defineConfig = (): ExpoConfig => ({
  name: 'inner-child',
  slug: 'innch',
  scheme: 'innch',
  version: '1.0.0',
  owner: 'inner-child',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F8F3EF',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/b0cd7774-1f25-4469-a2ed-21ae8e40206f',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.innch.app',
  },
  android: {
    package: 'com.innch.app',
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#F8F3EF',
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
