import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { api } from '~/utils/api';
import { SelectedPhoto } from '~/components/onboarding/SelectedPhoto';
import SelectPhotoButton from '~/components/onboarding/SelectPhotoButton';
import TakePhotoButton from '~/components/onboarding/TakePhotoButton';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { currentPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import { TakePhotoSVG } from '~/svg/takePhoto';
import { Onboarded } from '~/types';

export default function CurrentScreen() {
  useOnboardedScreen(Onboarded.Current);
  const router = useRouter();
  const { photo, handlePhoto, upload, canSubmit, isUploading } = useHandlePhoto('current', currentPhotoAtom);
  const { data: currentPhoto } = api.photo.getByAge.useQuery({ age: 'current' });

  const navigateToGenerateYoung = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.replace(ROUTES.ONBOARDING.GENERATE_YOUNG);
  }, [router]);

  const submitPhoto = useCallback(async () => {
    await upload();
    navigateToGenerateYoung();
  }, [navigateToGenerateYoung, upload]);

  useEffect(() => {
    if (currentPhoto) {
      navigateToGenerateYoung();
    }
  }, [navigateToGenerateYoung, currentPhoto]);

  if (!photo) {
    return (
      <View className="flex-1 px-4 pt-8">
        <View className="my-auto">
          <SelectedPhoto wrapped className="rounded-full" />
          <Text className="mt-8 text-center font-[Poppins-Bold] text-2xl">
            You can now upload your present face photo, and we {'\n'}will generate your inner-{'\n'}child and your
            future-self photos
          </Text>
          <Text className="mb-4 mt-4 text-center font-[Poppins] text-sm opacity-50">
            Just upload your saved photo or make selfie
          </Text>
        </View>
        <View className="mb-4">
          <SelectPhotoButton onSelect={(photo) => handlePhoto(photo.uri)} />
          <View className="h-4"></View>
          <TakePhotoButton onTake={(photo) => handlePhoto(photo.uri)} />
        </View>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 justify-center px-4">
        <View className="mb-20 rounded-xl border border-white/20 bg-white/10 p-4">
          <Image source={photo} className="h-[100%] w-[100%] rounded-lg" />
        </View>
      </View>
      <View className="mb-4 items-center justify-center px-4">
        <SelectPhotoButton title="Select another photo" onSelect={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <TakePhotoButton title="Take another photo" onTake={(photo) => handlePhoto(photo.uri)} />
        <View className="h-4"></View>
        <Button blue onPress={submitPhoto} disabled={!canSubmit || isUploading} wide>
          <Button.Text className="text-center text-lg">
            {isUploading ? 'Uploading...' : 'Ok, Upload this photo'}
          </Button.Text>
          <View className="w-2"></View>
          <TakePhotoSVG />
        </Button>
      </View>
    </>
  );
}
