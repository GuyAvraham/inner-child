import { useCallback, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useAtom, useAtomValue } from "jotai";

// import { replicate } from "~/utils/replicate";
import SelectionPhoto from "~/components/SelectionPhoto";
import { ROUTE } from "~/config/routes";
import useErrorsHandler from "~/hooks/useErrorsHandler";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";
import { currentPhotoAtom, oldPhotoAtom, youngPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

const generateAgedPhoto = async (
  photo: ImagePickerAsset,
  _age: Exclude<AgeMode, AgeMode.CURRENT>,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  return photo;
  // const generatedPhoto = await replicate.generateSAMImage({
  //   age: age === AgeMode.YOUNG ? 10 : 70,
  //   image: `data:image/jpeg;base64,${photo.base64!}`,
  // });

  // console.log(JSON.stringify(generatedPhoto, null, 2));
};

export default function GeneratingScreen() {
  const { handleError } = useErrorsHandler();

  const generateYoung = Boolean(
    useLocalSearchParams<{ young: string }>().young,
  );
  const { user } = useUser();
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPhoto = useAtomValue(currentPhotoAtom);
  const [youngPhoto, setYoungPhoto] = useAtom(youngPhotoAtom);
  const [oldPhoto, setOldPhoto] = useAtom(oldPhotoAtom);

  const { submitPhoto } = useSubmitPhoto();

  useEffect(() => {
    if (!currentPhoto || !generateYoung) return;

    void generateAgedPhoto(currentPhoto, AgeMode.YOUNG)
      .then(setYoungPhoto)
      .catch(handleError);
  }, [currentPhoto, generateYoung, handleError, setOldPhoto, setYoungPhoto]);

  useEffect(() => {
    if (!currentPhoto) return;

    void generateAgedPhoto(currentPhoto, AgeMode.OLD)
      .then(setOldPhoto)
      .catch(handleError);
  }, [currentPhoto, handleError, setOldPhoto]);

  useEffect(() => {
    setIsGenerating(!youngPhoto && !oldPhoto);
  }, [oldPhoto, youngPhoto]);

  const handleSubmit = useCallback(async () => {
    if (!youngPhoto || !oldPhoto) return;

    setIsSubmitting(true);
    await submitPhoto(youngPhoto, AgeMode.YOUNG);
    await submitPhoto(oldPhoto, AgeMode.OLD);

    await user?.update({
      unsafeMetadata: {
        onboarded: true,
      },
    });

    router.replace(ROUTE.ROOT);
  }, [oldPhoto, router, submitPhoto, user, youngPhoto]);

  return (
    <>
      <Text>Generating your photos</Text>
      <SelectionPhoto photo={youngPhoto} />
      <SelectionPhoto photo={oldPhoto} />
      <Button
        title={isSubmitting ? "submitting..." : "continue"}
        disabled={isGenerating}
        onPress={handleSubmit}
      />
    </>
  );
}
