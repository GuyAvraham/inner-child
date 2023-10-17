import { View } from 'react-native';

import LogInButton from '~/components/LogInButton';
import Text from '~/components/ui/Text';

export default function OAuthScreen() {
  return (
    <View className="relative flex-1 justify-center px-4">
      <Text className="text-center font-[Poppins-Bold] text-4xl leading-[48px]">
        Welcome to a time travel where you will be able to talk with your inner-child and your future-self
      </Text>
      <View className="mb-8 mt-12">
        <LogInButton />
      </View>
      <Text className="px-4 text-center text-sm">
        By signing up, you agree to our Terms, Privacy Policy and Cookie use
      </Text>
    </View>
  );
}
