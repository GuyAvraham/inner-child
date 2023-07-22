import { View } from "react-native";
import { Slot } from "expo-router";

export default function OnboardingLayout() {
  return (
    <View className=" flex h-full justify-center p-8">
      <Slot />
    </View>
  );
}
