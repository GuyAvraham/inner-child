import type { ExpoConfig } from '@expo/config';

// Yehor's account
// const owner = undefined;
// const projectId = '0002b00c-20f6-4e5b-b66a-015219f0f07b';

// Guy's account (inner-child organization)
// const owner = 'inner-child';
// const projectId = '681adfac-b237-4a20-b8a2-1abe99128a38';

// Guy personal
const owner = undefined;
const projectId = '8d3e99f7-8501-45f3-8065-4bd53e160b63';

const bundleId = 'com.guyavraham.innerchild';
const buildNumber = 3;

const defineConfig = (): ExpoConfig => ({
  name: 'Inner Child',
  slug: 'inner-child',
  scheme: 'tamagochi-inner-child',
  version: '1.0.2',
  owner,
  orientation: 'portrait',
  icon: './assets/logo.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#4285F4',
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
      foregroundImage: './assets/logo-android.png',
      backgroundColor: '#4285F4',
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
