import { useEffect, useState } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useAtom, useAtomValue } from "jotai";

import { replicate } from "~/utils/replicate";
import SelectionPhoto from "~/components/SelectionPhoto";
import useErrorsHandler from "~/hooks/useErrorsHandler";
import { currentPhotoAtom, oldPhotoAtom, youngPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

const generateAgedPhoto = async (
  photo: ImagePickerAsset,
  age: Exclude<AgeMode, AgeMode.CURRENT>,
) => {
  const generatedPhoto = await replicate.generateSAMImage({
    age: age === AgeMode.YOUNG ? 10 : 70,
    image: `data:image/jpeg;base64,${photo.base64!}`,
  });

  console.log(JSON.stringify(generatedPhoto, null, 2));
};

export default function GeneratingScreen() {
  const { handleError } = useErrorsHandler();

  const generateYoung = Boolean(
    useLocalSearchParams<{ young: string }>().young,
  );

  const [isGenerating, setIsGenerating] = useState(true);

  const currentPhoto = useAtomValue(currentPhotoAtom);
  const [youngPhoto, setYoungPhoto] = useAtom(youngPhotoAtom);
  const [oldPhoto, setOldPhoto] = useAtom(oldPhotoAtom);

  useEffect(() => {
    if (!currentPhoto || !generateYoung) return;

    void generateAgedPhoto(currentPhoto, AgeMode.YOUNG);
    // .then(setYoungPhoto)
    // .catch(handleError);
  }, [currentPhoto, generateYoung, handleError, setOldPhoto, setYoungPhoto]);

  useEffect(() => {
    if (!currentPhoto) return;

    void generateAgedPhoto(currentPhoto, AgeMode.OLD);
    // .then(setOldPhoto)
    // .catch(handleError);
  }, [currentPhoto, handleError, setOldPhoto]);

  useEffect(() => {
    setIsGenerating(!youngPhoto && !oldPhoto);
  }, [oldPhoto, youngPhoto]);

  return (
    <>
      <Text>Generating your photos</Text>
      <SelectionPhoto photo={youngPhoto} />
      <SelectionPhoto photo={oldPhoto} />
      <Button title="continue" disabled={isGenerating} />
    </>
  );
}
