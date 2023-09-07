import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { api } from '~/utils/api';
import { generateToken } from '~/utils/token';
import { AnimatedProgress } from '~/components/AnimatedProgress';
import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { WhiteCircle } from '~/components/ui/WhiteCircle';
import { currentPhotoAtom, oldPhotoAtom, youngPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import useUserData from '~/hooks/useUserData';
import { ReplacePhotoSVG } from '~/svg/replacePhoto';
import { UploadPhotoSVG } from '~/svg/uploadPhoto';
import { Age, Onboarded } from '~/types';

export default function GenerateScreen() {
  useOnboardedScreen(Onboarded.Generate);
  const utils = api.useContext();
  const [isReplacing, setIsReplacing] = useState(false);
  const router = useRouter();
  const currentPhoto = useAtomValue(currentPhotoAtom);
  const {
    photo: youngPhoto,
    canSubmit: canSubmitYoungPhoto,
    handlePhoto: handleYoungPhoto,
    isUploading: isYoungPhotoUploading,
    upload: uploadYoungPhoto,
  } = useHandlePhoto(Age.Young, youngPhotoAtom);
  const {
    photo: oldPhoto,
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto(Age.Old, oldPhotoAtom);
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({ age: 'current' });
  const { updateUserData } = useUserData();
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  const { oldPhoto: generatedOldPhoto, youngPhoto: generatedYoungPhoto } = useGenerateAgedPhotos({
    old: !oldPhoto,
    young: !youngPhoto,
  });

  useEffect(() => {
    if (!generatedYoungPhoto) return;
    void handleYoungPhoto(generatedYoungPhoto);
  }, [generatedYoungPhoto, handleYoungPhoto]);

  useEffect(() => {
    if (!generatedOldPhoto) return;
    void handleOldPhoto(generatedOldPhoto);
  }, [generatedOldPhoto, handleOldPhoto]);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.replace(ROUTES.ONBOARDING.CURRENT);
  }, [router, updateUserData, utils.photo, deleteAllPhotos]);

  const submitPhoto = useCallback(async () => {
    if (!canSubmitOldPhoto && !canSubmitYoungPhoto) return;

    await Promise.allSettled([uploadOldPhoto(), uploadYoungPhoto()]);
    await updateUserData({ onboarded: Onboarded.Finished });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.push(ROUTES.INDEX);
  }, [canSubmitOldPhoto, canSubmitYoungPhoto, router, updateUserData, uploadOldPhoto, uploadYoungPhoto]);

  return (
    <>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-between">
          {(!oldPhoto || !youngPhoto) && <Text className="self-start">It might take up to 20 seconds...</Text>}

          {!youngPhoto ? (
            <>
              <WhiteCircle>
                <AnimatedProgress />
              </WhiteCircle>
              <Text>Generating your inner child image...</Text>
            </>
          ) : (
            <WhiteCircle>
              <SelectedPhoto className="h-28 w-28 rounded-full" source={youngPhoto} />
            </WhiteCircle>
          )}

          <SelectedPhoto wrapped className="rounded-full" source={currentPhoto ?? currentPhotoDB?.uri} />

          {!oldPhoto ? (
            <>
              <WhiteCircle>
                <AnimatedProgress />
              </WhiteCircle>
              <Text>...and future-self image.</Text>
            </>
          ) : (
            <WhiteCircle>
              <SelectedPhoto className="h-28 w-28 rounded-full" source={oldPhoto} />
            </WhiteCircle>
          )}
        </View>
      </ScrollView>

      {youngPhoto && oldPhoto && (
        <View className="mt-20 items-center justify-center px-4">
          <Button onPress={submitPhoto} wide blue disabled={!canSubmitOldPhoto || !canSubmitYoungPhoto}>
            <Button.Text className="text-center text-lg">
              {isYoungPhotoUploading || isOldPhotoUploading ? 'Uploading...' : 'Upload these photos'}
            </Button.Text>
            <View className="w-2"></View>
            <UploadPhotoSVG />
          </Button>
          <View className="h-4"></View>
          <Button onPress={replacePhotos} wide>
            <Button.Text className="text-center text-lg">
              {isReplacing ? 'Clearing...' : 'Choose another photo'}
            </Button.Text>
            <View className="w-2"></View>
            <ReplacePhotoSVG />
          </Button>
        </View>
      )}
    </>
  );
}
