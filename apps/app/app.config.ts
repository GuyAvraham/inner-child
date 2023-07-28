import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "Inner Child",
  slug: "innch",
  scheme: "innch",
  version: "1.0.0",
  owner: "inner-child",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/b0cd7774-1f25-4469-a2ed-21ae8e40206f",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.innch.app",
  },
  android: {
    package: "com.innch.app",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  extra: {
    eas: {
      projectId: "b0cd7774-1f25-4469-a2ed-21ae8e40206f",
    },
    apiURL: process.env.API_URL,
    clerkPublicKey: process.env.CLERK_PUBLIC_KEY,
    replicateToken: process.env.REPLICATE_API_TOKEN,
  },
  plugins: [
    [
      "expo-image-picker",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera.",
      },
    ],
    "./expo-plugins/with-modify-gradle.js",
  ],
});

export default defineConfig;
