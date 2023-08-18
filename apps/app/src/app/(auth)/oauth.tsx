import { Text, View } from 'react-native';

import LogInButton from '~/components/LogInButton';

export default function OAuthScreen() {
  return (
    <>
      <View className="flex-1 justify-center px-6">
        <Text className="text-lg">
          Some welcome image and text. Maybe even carousel 😏
        </Text>
      </View>
      <View className="h-1/4 items-center justify-center">
        <LogInButton />
      </View>
    </>
  );
}
