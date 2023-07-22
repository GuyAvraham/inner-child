import { Text, View } from "react-native";

import LogInButton from "~/components/LogInButton";

export default function LoginScreen() {
  return (
    <View className="flex h-full p-8">
      <View className="flex flex-1 justify-center">
        <Text className="text-lg">
          Some welcome image and text. Maybe even carousel 😏
        </Text>
      </View>
      <View className="flex h-1/4 items-center justify-center">
        <LogInButton />
      </View>
    </View>
  );
}
