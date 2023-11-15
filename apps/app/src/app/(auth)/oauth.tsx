import {View} from 'react-native';

import LogInButton from '~/components/LogInButton';
import Text from '~/components/ui/Text';
import {LogoSVG} from '~/svg/logo';

export default function OAuthScreen() {
  return (
    <View className="relative flex-1 justify-center px-4">
      <View className="mb-auto mt-20 items-center">
        <LogoSVG/>
        <Text className="mt-3 font-[Poppins-Bold] text-lg">Inner Child Tamagotchi</Text>
      </View>
      <Text className="mb-4 text-center font-[Poppins-Bold] text-4xl leading-[48px]">
        Welcome to a time travel app.
      </Text>
      <Text className="mb-4 text-center font-[Poppins-Bold] text-4xl leading-[48px]">
        Interact with your inner-child and your future-self.
      </Text>
      <View className="mb-4 mt-auto">
        <View className="mb-8 ">
          <LogInButton/>
        </View>
        <Text className="px-4 text-center text-sm">
          By signing up, you agree to our Terms, Privacy Policy and Cookie use
        </Text>
      </View>
    </View>
  );
}
