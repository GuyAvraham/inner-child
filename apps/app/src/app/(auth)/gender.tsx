import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

import { generateToken } from '~/utils/token';
import Button from '~/components/Button';

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
    <>
      <View className="flex-1 justify-center px-6">
        <Text className="text-lg">We need your gender to properly operate</Text>
      </View>
      <View className="h-1/4 flex-row items-center justify-center gap-4">
        <Button
          onPress={() => setUserGender('male')}
          className="min-w-[100px] items-center">
          <Button.Text className="text-lg">Male</Button.Text>
        </Button>
        <Button
          onPress={() => setUserGender('female')}
          className="min-w-[100px] items-center">
          <Button.Text className="text-lg">Female</Button.Text>
        </Button>
      </View>
    </>
  );
}
