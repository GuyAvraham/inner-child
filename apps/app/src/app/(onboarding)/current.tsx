import { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import SelectPhotoButton from '~/components/onboarding/SelectPhotoButton';
import TakePhotoButton from '~/components/onboarding/TakePhotoButton';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { currentPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';

export default function CurrentScreen() {
  useOnboardedScreen('current');

  const router = useRouter();

  const { photo, handlePhoto, upload, canSubmit, isUploading } = useHandlePhoto('current', currentPhotoAtom);

  const submitPhoto = useCallback(async () => {
    await upload();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.push(ROUTES.ONBOARDING.YOUNG);
  }, [router, upload]);

  return (
    <>
      <View className="flex-1 justify-center px-6">
        <SelectedPhoto source={photo} />
        <Text className="mt-2 text-center font-[Poppins-Italic]">Current Photo</Text>
      </View>
      <View className="items-center justify-center px-4">
        <SelectPhotoButton onSelect={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <TakePhotoButton onTake={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <Button onPress={submitPhoto} disabled={!canSubmit} wide>
          <Button.Text className="text-center text-lg">{isUploading ? 'Uploading...' : 'Upload'}</Button.Text>
        </Button>
      </View>
    </>
  );
}
