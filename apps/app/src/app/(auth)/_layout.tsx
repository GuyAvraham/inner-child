import { View } from 'react-native';
import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <View className="flex-1 px-4">
      <Slot />
    </View>
  );
}
