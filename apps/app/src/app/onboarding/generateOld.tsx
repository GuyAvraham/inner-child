import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { api } from '~/utils/api';
import { generateToken } from '~/utils/token';
import { PhotoSelect } from '~/components/onboarding/PhotoSelect';
import { SelectedPhoto } from '~/components/onboarding/SelectedPhoto';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { oldPhotoAtom, useCurrentPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import useUserData from '~/hooks/useUserData';
import { NextSVG } from '~/svg/next';
import { ReplacePhotoSVG } from '~/svg/replacePhoto';
import { Age, Onboarded } from '~/types';

export default function GenerateOldScreen() {
  useOnboardedScreen(Onboarded.GenerateOld);
  const utils = api.useContext();
  const [isReplacing, setIsReplacing] = useState(false);
  const router = useRouter();
  const [currentPhoto] = useCurrentPhotoAtom();
  const {
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto(Age.Old, oldPhotoAtom);

  const { updateUserData } = useUserData();
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({ age: 'current' });
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  const generatedPhotos = useGenerateAgedPhotos(Age.Old);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.replace(ROUTES.ONBOARDING.CURRENT);
  }, [router, updateUserData, utils.photo, deleteAllPhotos]);

  useEffect(() => {
    if (currentPhotoDB === null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.replace(ROUTES.ONBOARDING.CURRENT);
    }
  }, [currentPhotoDB, router]);

  const submitPhoto = useCallback(async () => {
    if (!canSubmitOldPhoto) return;

    await uploadOldPhoto();
    await updateUserData({ onboarded: Onboarded.Finished });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.push(ROUTES.INDEX);
  }, [canSubmitOldPhoto, router, updateUserData, uploadOldPhoto]);

  const generationFinished = useMemo(
    () => generatedPhotos.every((photo) => typeof photo === 'string'),
    [generatedPhotos],
  );

  return (
    <>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center">
          {!generationFinished && <Text className="mb-14">It might take up to 2 minutes...</Text>}

          <View className="relative items-center justify-center rounded-full border border-white/40 bg-white/20 p-4">
            <SelectedPhoto className="rounded-full" source={currentPhoto ?? currentPhotoDB?.uri} />
            <TouchableOpacity
              className="absolute -bottom-4 -right-4 rounded-full bg-white/20 p-[6]"
              onPress={replacePhotos}
              disabled={isReplacing || isOldPhotoUploading}
            >
              <ReplacePhotoSVG />
            </TouchableOpacity>
          </View>
          <Text className="mb-14 mt-10">Generating your future images...</Text>

          <View className="w-full">
            <Text className="self-start">AI generated future photos: </Text>
            <PhotoSelect photos={generatedPhotos} onPhotoSelect={handleOldPhoto} />
          </View>
        </View>
      </ScrollView>

      <View className="mb-4 mt-10 items-center justify-center px-4">
        <Button onPress={submitPhoto} wide blue disabled={!canSubmitOldPhoto || isOldPhotoUploading}>
          <Button.Text className="text-center text-lg">{isOldPhotoUploading ? 'Saving...' : 'Continue'}</Button.Text>
          <View className="w-2"></View>
          <NextSVG />
        </Button>
      </View>
    </>
  );
}
