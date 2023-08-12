import { useCallback, useState } from "react";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom, useSetAtom } from "jotai";

import { cropToFace } from "~/utils/cropToFace";
import SelectionPhoto from "~/components/SelectionPhoto";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import useUploadPhoto from "~/hooks/useUploadPhoto";
import { currentPhotoAtom, originalPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

export default function CurrentPhotoScreen() {
  const router = useRouter();

  const setOriginalPhoto = useSetAtom(originalPhotoAtom);
  const [currentPhoto, setCurrentPhoto] = useAtom(currentPhotoAtom);

  const { isUploading, uploadPhoto } = useUploadPhoto();

  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (!currentPhoto) return;

    await uploadPhoto(currentPhoto, AgeMode.CURRENT);

    setWarning(false);
    router.push(ROUTE.ONBOARDING.YOUNG);
  }, [currentPhoto, router, uploadPhoto]);

  return (
    <>
      <Text>Take or upload a photo against plain surface</Text>
      <SelectionPhoto
        source={currentPhoto ? { uri: currentPhoto } : undefined}
      />
      {isCropping ? <Text>Cropping face</Text> : null}
      <SubmitPhoto
        enableCamera
        onSelect={(photo) => {
          setOriginalPhoto(photo);
          setCurrentPhoto(photo.uri);
          setIsCropping(true);

          cropToFace(photo.uri)
            .then((result) => {
              setCurrentPhoto(result.uri);
            })
            .catch(() => {
              setWarning(true);
            })
            .finally(() => {
              setIsCropping(false);
            });
        }}
      />
      <Button
        title={
          isUploading
            ? "submitting..."
            : warning
            ? "no face detected! submit anyway"
            : "submit"
        }
        onPress={handleSubmit}
        disabled={!currentPhoto || isCropping}
      />
    </>
  );
}
