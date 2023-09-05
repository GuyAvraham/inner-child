import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { api } from '~/utils/api';
import { blobToUri } from '~/utils/blob';
import SelectedPhoto from '~/components/onboarding/SelectedPhoto';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';
import { currentPhotoAtom, generateYoungAtom, oldPhotoAtom, youngPhotoAtom } from '~/atoms';
import { ROUTES } from '~/config/routes';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import useUserData from '~/hooks/useUserData';

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
      <ScrollView className="flex-1 px-6">
        <SelectedPhoto
          className="h-48 w-48"
          source={youngPhoto ? youngPhoto : youngPhotoDB ? youngPhotoDB.uri : currentPhoto ?? currentPhotoDB?.uri}
          blurRadius={!youngPhoto && !youngPhotoDB ? 100 : 0}
        />
        <SelectedPhoto className="h-48 w-48" source={currentPhoto ?? currentPhotoDB?.uri} />
        <SelectedPhoto
          className="h-48 w-48"
          source={oldPhoto ? oldPhoto : currentPhoto ?? currentPhotoDB?.uri}
          blurRadius={!oldPhoto ? 100 : 0}
        />
        <Text className="text-md mb-4 font-[Poppins-Italic]">
          {oldPhoto && youngPhoto ? 'Generated photos' : 'Generating photos (might take up to 20 seconds)...'}
        </Text>
      </ScrollView>
      <View className="items-center justify-center">
        <Button
          onPress={submitPhoto}
          wide
          disabled={!canSubmitOldPhoto && (!youngPhotoDB || !generateYoung || !canSubmitYoungPhoto)}
        >
          <Button.Text className="text-center text-lg">
            {isYoungPhotoUploading || isOldPhotoUploading ? 'Uploading...' : 'Upload'}
          </Button.Text>
        </Button>
      </View>
    </>
  );
}
