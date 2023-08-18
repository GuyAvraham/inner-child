import { View } from 'react-native';
import { Slot } from 'expo-router';

import { isAndroid } from '~/config/variables';

export default function HomeLayout() {
  return (
    <View className={`flex-1 px-4 ${isAndroid ? 'py-6' : ''}`}>
      <Slot />
    </View>
  );
}
