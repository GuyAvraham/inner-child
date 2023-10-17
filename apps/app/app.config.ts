import type { ExpoConfig } from '@expo/config';

const owner = 'inner-child';
const projectId = 'b0cd7774-1f25-4469-a2ed-21ae8e40206f';
const bundleId = 'com.tamagochi.inner.child.app';

const buildNumber = 1;

const defineConfig = (): ExpoConfig => ({
  name: 'Inner Child',
  slug: 'innch',
  scheme: 'tamagochi-inner-child',
  version: '1.0.0',
  owner,
  orientation: 'portrait',
  icon: './assets/splash.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: 'rgb(66,133,244)',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${projectId}`,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
    buildNumber: String(buildNumber),
  },
  android: {
    package: bundleId,
    versionCode: buildNumber,
    adaptiveIcon: {
      foregroundImage: './assets/splash.png',
      backgroundColor: 'rgb(66,133,244)',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId,
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
