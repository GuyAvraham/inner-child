import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '~/components/Button';
import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import SelectPhotoButton from '~/components/onboarding/SelectPhotoButton';
import TakePhotoButton from '~/components/onboarding/TakePhotoButton';
import { currentPhotoAtom } from '~/atoms';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';

export default function CurrentScreen() {
  useOnboardedScreen('current');

  const router = useRouter();

  const { photo, handlePhoto, upload, canSubmit, isUploading } = useHandlePhoto(
    'current',
    currentPhotoAtom,
  );

  const submitPhoto = useCallback(async () => {
    await upload();

    router.push('/(onboarding)/young');
  }, [router, upload]);

  return (
    <>
      <View className="flex-1 justify-center px-6">
        <SelectedPhoto source={photo} />
        <Text className="mt-2 text-center italic text-slate-500">
          Current Photo
        </Text>
      </View>
      <View className="items-center justify-center">
        <SelectPhotoButton onSelect={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <TakePhotoButton onTake={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <Button
          onPress={submitPhoto}
          className={`${!canSubmit ? 'bg-slate-600' : ''} w-full`}
          disabled={!canSubmit}>
          <Button.Text className="text-center text-lg">
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button.Text>
        </Button>
      </View>
    </>
  );
}
