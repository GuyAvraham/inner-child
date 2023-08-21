import { View } from 'react-native';

import LogInButton from '~/components/LogInButton';
import Text from '~/components/ui/Text';

export default function OAuthScreen() {
  return (
    <>
      <View className="flex-1 justify-center px-6">
        <Text className="font-[Poppins] text-lg text-white">
          Some welcome image and text. Maybe even carousel 😏
        </Text>
      </View>
      <View className="items-center justify-center py-8">
        <LogInButton />
      </View>
    </>
  );
}
