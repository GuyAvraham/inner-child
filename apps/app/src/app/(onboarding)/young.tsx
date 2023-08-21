import { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import SelectPhotoButton from '~/components/onboarding/SelectPhotoButton';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { currentPhotoAtom, generateYoungAtom, youngPhotoAtom } from '~/atoms';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';

export default function YoungScreen() {
  useOnboardedScreen('young');

  const router = useRouter();

  const currentPhoto = useAtomValue(currentPhotoAtom);
  const { photo, handlePhoto, upload, canSubmit, isUploading } = useHandlePhoto(
    'young',
    youngPhotoAtom,
  );
  const setGenerateYoung = useSetAtom(generateYoungAtom);

  const submitPhoto = useCallback(async () => {
    await upload();

    router.push('/(onboarding)/generate');
  }, [router, upload]);

  return (
    <>
      <View className="flex-1 justify-center px-6">
        <SelectedPhoto
          source={photo ? photo : currentPhoto}
          blurRadius={!photo ? 100 : 0}
        />
        <Text className="mt-2 text-center font-[Poppins-Italic]">
          Child Photo
        </Text>
      </View>
      <View className="h-1/4 items-center justify-center">
        <SelectPhotoButton onSelect={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <Button
          onPress={() => {
            setGenerateYoung(true);
            router.push('/(onboarding)/generate');
          }}
          wide>
          <Button.Text>Generate</Button.Text>
        </Button>
        <View className="h-4"></View>
        <Button
          onPress={submitPhoto}
          disabled={!canSubmit}
          wide>
          <Button.Text> {isUploading ? 'Uploading...' : 'Upload'}</Button.Text>
        </Button>
      </View>
    </>
  );
}
