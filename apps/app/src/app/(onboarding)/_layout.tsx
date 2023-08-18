import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

import { isAndroid } from '~/config/variables';

export default function AuthLayout() {
  return (
    <SafeAreaView className={`flex-1 px-4 ${isAndroid ? 'py-6' : ''}`}>
      <Slot />
    </SafeAreaView>
  );
}
