import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "Inner Child",
  slug: "innch",
  scheme: "innch",
  version: "1.0.0",
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
    url: "https://u.expo.dev/d82099cc-7eac-4848-b79f-006676b945d5",
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
      projectId: "d82099cc-7eac-4848-b79f-006676b945d5",
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
