import { View } from "react-native";
import { Slot } from "expo-router";

export default function OnboardingLayout() {
  return (
    <View className="flex p-8">
      <Slot />
    </View>
  );
}
