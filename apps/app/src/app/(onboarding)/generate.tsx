import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { api } from '~/utils/api';
import { blobToUri } from '~/utils/blob';
import { generateToken } from '~/utils/token';
import { AnimatedProgress } from '~/components/AnimatedProgress';
import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { WhiteCircle } from '~/components/ui/WhiteCircle';
import { currentPhotoAtom, generateYoungAtom, oldPhotoAtom, youngPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import useUserData from '~/hooks/useUserData';
import { ReplacePhotoSVG } from '~/svg/replacePhoto';
import { UploadPhotoSVG } from '~/svg/uploadPhoto';

const useGenerateAgedPhotos = ({ old, young }: { old: boolean; young: boolean }) => {
  const [youngPredictionId, setYoungPredictionId] = useState<string | null>(null);
  const [oldPredictionId, setOldPredictionId] = useState<string | null>(null);

  const [youngPhoto, setYoungPhoto] = useState<string | undefined>(undefined);
  const [oldPhoto, setOldPhoto] = useState<string | undefined>(undefined);

  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();

  const { data: youngPhotoURI } = api.photo.wait.useQuery(
    {
      predictionId: youngPredictionId!,
    },
    { enabled: young && !!youngPredictionId, refetchInterval: 2000 },
  );
  const { data: oldPhotoURI } = api.photo.wait.useQuery(
    {
      predictionId: oldPredictionId!,
    },
    { enabled: old && !!oldPredictionId, refetchInterval: 2000 },
  );

  const fetchPhoto = useCallback(async (photoUrl: string) => {
    const blob = await (await fetch(photoUrl)).blob();

    return await blobToUri(blob);
  }, []);

  useEffect(() => {
    if (!youngPhotoURI) return;

    void fetchPhoto(youngPhotoURI).then((data) => {
      setYoungPhoto(data);
    });
  }, [fetchPhoto, youngPhotoURI]);

  useEffect(() => {
    if (!oldPhotoURI) return;

    void fetchPhoto(oldPhotoURI).then((data) => {
      setOldPhoto(data);
    });
  }, [fetchPhoto, oldPhotoURI]);

  const generate = useCallback(async () => {
    if (young) {
      const youngPredictionId = await generateAged({ age: 'young' });
      setYoungPredictionId(youngPredictionId.id);
    }

    const oldPredictionId = await generateAged({ age: 'old' });
    setOldPredictionId(oldPredictionId.id);
  }, [generateAged, young]);

  useEffect(() => {
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { youngPhoto, oldPhoto };
};

export default function GenerateScreen() {
  useOnboardedScreen('generate');
  const [isReplacing, setIsReplacing] = useState(false);
  const router = useRouter();
  const generateYoung = useAtomValue(generateYoungAtom);

  const currentPhoto = useAtomValue(currentPhotoAtom);
  const {
    photo: youngPhoto,
    canSubmit: canSubmitYoungPhoto,
    handlePhoto: handleYoungPhoto,
    isUploading: isYoungPhotoUploading,
    upload: uploadYoungPhoto,
  } = useHandlePhoto('young', youngPhotoAtom);
  const {
    photo: oldPhoto,
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto('old', oldPhotoAtom);
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({
    age: 'current',
  });
  const { data: youngPhotoDB } = api.photo.getByAge.useQuery(
    {
      age: 'young',
    },
    { enabled: !generateYoung },
  );
  const { updateUserData } = useUserData();
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  const utils = api.useContext();
  const { oldPhoto: generatedOldPhoto, youngPhoto: generatedYoungPhoto } = useGenerateAgedPhotos({
    old: !oldPhoto,
    young: !generateYoung || !youngPhoto || !youngPhotoDB,
  });

  useEffect(() => {
    if (!generateYoung || !generatedYoungPhoto) return;

    void handleYoungPhoto(generatedYoungPhoto);
  }, [generateYoung, generatedYoungPhoto, handleYoungPhoto]);

  useEffect(() => {
    if (!generatedOldPhoto) return;

    void handleOldPhoto(generatedOldPhoto);
  }, [generatedOldPhoto, handleOldPhoto]);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({
      token: generateToken(),
      onboarded: 'current',
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.replace(ROUTES.ONBOARDING.CURRENT);
  }, [router, updateUserData, utils.photo, deleteAllPhotos]);

  const submitPhoto = useCallback(async () => {
    if (!canSubmitOldPhoto && (generateYoung || !canSubmitYoungPhoto)) return;

    await uploadOldPhoto();
    if (generateYoung) await uploadYoungPhoto();

    await updateUserData({
      onboarded: 'finished',
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.push(ROUTES.INDEX);
  }, [canSubmitOldPhoto, canSubmitYoungPhoto, generateYoung, router, updateUserData, uploadOldPhoto, uploadYoungPhoto]);

  return (
    <>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-between">
          {!oldPhoto && !youngPhoto && (
            <Text className="self-start font-[Poppins]">It might take up to 20 seconds...</Text>
          )}

          {!youngPhoto && !youngPhotoDB ? (
            <>
              <WhiteCircle>
                <AnimatedProgress />
              </WhiteCircle>
              <Text className="font-[Poppins]">Generating your inner child image...</Text>
            </>
          ) : (
            <WhiteCircle>
              <SelectedPhoto className="h-28 w-28 rounded-full" source={youngPhoto ?? youngPhotoDB?.uri} />
            </WhiteCircle>
          )}

          <SelectedPhoto wrapped className="rounded-full" source={currentPhoto ?? currentPhotoDB?.uri} />

          {!oldPhoto ? (
            <>
              <WhiteCircle>
                <AnimatedProgress />
              </WhiteCircle>
              <Text className="font-[Poppins]">...and future-self image.</Text>
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
          <Button
            onPress={submitPhoto}
            wide
            blue
            disabled={!canSubmitOldPhoto && (!youngPhotoDB || !generateYoung || !canSubmitYoungPhoto)}
          >
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
