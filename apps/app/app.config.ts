import type { ExpoConfig } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_b3B0aW1hbC1zbmFwcGVyLTYwLmNsZXJrLmFjY291bnRzLmRldiQ";

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
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.innch.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "d82099cc-7eac-4848-b79f-006676b945d5",
    },
    CLERK_PUBLISHABLE_KEY,
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
