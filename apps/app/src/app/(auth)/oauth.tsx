import { View } from 'react-native';

import LogInButton from '~/components/LogInButton';
import Text from '~/components/ui/Text';

export default function OAuthScreen() {
  return (
    <>
      <View className="relative flex-1 justify-center px-6">
        <View className="absolute left-1/2 top-20 -translate-x-6 items-center">
          <View className="mb-2 h-7 w-7 rounded-full bg-blue-500" />
          <Text className="text-center font-[Poppins-Bold]">Untitled App</Text>
        </View>
        <Text className="text-center font-[Poppins-Bold] text-4xl leading-[48px] text-white">
          Welcome to a time travel where you will be able to talk with your
          inner-child and your future-self
        </Text>
        <View className="mb-8 mt-12">
          <LogInButton />
        </View>
        <Text className="text-center text-sm text-[Poppins]">
          By signing up, you agree to our Terms, Privacy Policy and Cookie use
        </Text>
      </View>
    </>
  );
}
