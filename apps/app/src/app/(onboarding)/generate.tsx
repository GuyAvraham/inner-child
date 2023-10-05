import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import clsx from 'clsx';
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
import { NextSVG } from '~/svg/next';
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
  const { oldPhotos: generatedOldPhotos, youngPhotos: generatedYoungPhotos } = useGenerateAgedPhotos();
  const [youngIndex, setYoungIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);
  const generatedYoungPhoto = useMemo(() => generatedYoungPhotos[youngIndex], [generatedYoungPhotos, youngIndex]);
  const generatedOldPhoto = useMemo(() => generatedOldPhotos[oldIndex], [generatedOldPhotos, oldIndex]);

  const pressPrevYoungIndex = useCallback(() => {
    setYoungIndex((prev) => Math.max(0, prev - 1));
  }, []);
  const pressNextYoungIndex = useCallback(() => {
    setYoungIndex((prev) => Math.min(generatedYoungPhotos.length - 1, prev + 1));
  }, [generatedYoungPhotos]);
  const pressPrevOldIndex = useCallback(() => {
    setOldIndex((prev) => Math.max(0, prev - 1));
  }, []);
  const pressNextOldIndex = useCallback(() => {
    setOldIndex((prev) => Math.min(generatedOldPhotos.length - 1, prev + 1));
  }, [generatedOldPhotos]);

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

  const isPrevYoungDisabled = useMemo(() => youngIndex === 0, [youngIndex]);
  const isNextYoungDisabled = useMemo(
    () => youngIndex + 1 === generatedYoungPhotos.length,
    [generatedYoungPhotos, youngIndex],
  );
  const isPrevOldDisabled = useMemo(() => oldIndex === 0, [oldIndex]);
  const isNextOldDisabled = useMemo(() => oldIndex + 1 === generatedOldPhotos.length, [generatedOldPhotos, oldIndex]);
  const allYoungGenerated = useMemo(() => generatedYoungPhotos.every((photo) => photo), [generatedYoungPhotos]);
  const allOldGenerated = useMemo(() => generatedOldPhotos.every((photo) => photo), [generatedOldPhotos]);

  return (
    <>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-between">
          {(!oldPhoto || !youngPhoto) && <Text className="self-start">It might take up to 20 seconds...</Text>}

          <TouchableOpacity
            className={clsx('absolute left-4 top-[64]', isPrevYoungDisabled && 'opacity-20')}
            onPress={pressPrevYoungIndex}
            disabled={isPrevYoungDisabled}
          >
            <NextSVG rotate />
          </TouchableOpacity>
          <TouchableOpacity
            className={clsx('absolute right-4 top-[64]', isNextYoungDisabled && 'opacity-20')}
            onPress={pressNextYoungIndex}
            disabled={isNextYoungDisabled}
          >
            <NextSVG />
          </TouchableOpacity>
          <WhiteCircle>
            {!generatedYoungPhoto ? (
              <AnimatedProgress />
            ) : (
              <SelectedPhoto className="h-28 w-28 rounded-full" source={youngPhoto} />
            )}
          </WhiteCircle>
          {(!youngPhoto || !allYoungGenerated) && (
            <Text>
              Generating your inner child images...{' '}
              <Text>
                ({generatedYoungPhotos.filter(Boolean).length} of {generatedYoungPhotos.length})
              </Text>
            </Text>
          )}

          <SelectedPhoto wrapped className="my-4 rounded-full" source={currentPhoto ?? currentPhotoDB?.uri} />

          <WhiteCircle>
            {!generatedOldPhoto ? (
              <AnimatedProgress />
            ) : (
              <SelectedPhoto className="h-28 w-28 rounded-full" source={oldPhoto} />
            )}
          </WhiteCircle>
          {(!oldPhoto || !allOldGenerated) && (
            <Text className="mb-4">
              ...and future-self images.{' '}
              <Text>
                ({generatedOldPhotos.filter(Boolean).length} of {generatedOldPhotos.length})
              </Text>
            </Text>
          )}

          <TouchableOpacity
            className={clsx('absolute bottom-[64] left-4', isPrevOldDisabled && 'opacity-20')}
            onPress={pressPrevOldIndex}
            disabled={isPrevOldDisabled}
          >
            <NextSVG rotate />
          </TouchableOpacity>
          <TouchableOpacity
            className={clsx('absolute bottom-[64] right-4', isNextOldDisabled && 'opacity-20')}
            onPress={pressNextOldIndex}
            disabled={isNextOldDisabled}
          >
            <NextSVG />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {youngPhoto && oldPhoto && (
        <View className="mb-4 mt-10 items-center justify-center px-4">
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
