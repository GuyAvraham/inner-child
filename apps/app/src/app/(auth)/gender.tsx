import { useCallback } from 'react';
import { View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

import { generateToken } from '~/utils/token';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';

export default function GenderScreen() {
  const { user } = useUser();

  const setUserGender = useCallback(
    async (gender: 'male' | 'female') => {
      if (!user) return;

      await user.update({
        unsafeMetadata: {
          gender,
          token: generateToken(),
        },
      });
    },
    [user],
  );

  return (
    <View className="flex-1 justify-center px-4">
      <Text className="font-[Poppins-Bold] text-4xl leading-[48px] text-white">
        Our image engine needs to understand if you are more of a {'\n'}male or female?
      </Text>

      <View className="mb-8 mt-auto">
        <Button onPress={() => setUserGender('male')} wide>
          <Button.Text>Male</Button.Text>
        </Button>
        <View className="h-4"></View>
        <Button onPress={() => setUserGender('female')} wide>
          <Button.Text>Female</Button.Text>
        </Button>
      </View>
    </View>
  );
}
