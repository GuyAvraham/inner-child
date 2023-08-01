import { useCallback } from "react";
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

  const handleSubmit = useCallback(async () => {
    if (!currentPhoto) return;

    await uploadPhoto(currentPhoto, AgeMode.CURRENT);

    router.push(ROUTE.ONBOARDING.YOUNG);
  }, [currentPhoto, router, uploadPhoto]);

  return (
    <>
      <Text>Take or upload a photo against plain surface</Text>
      <SelectionPhoto
        source={currentPhoto ? { uri: currentPhoto } : undefined}
      />
      <SubmitPhoto
        enableCamera
        onSelect={(photo) => {
          setOriginalPhoto(photo);

          void cropToFace(photo.uri).then((result) => {
            setCurrentPhoto(result.uri);
          });
        }}
      />
      <Button
        title={isUploading ? "submitting..." : "submit"}
        onPress={handleSubmit}
        disabled={!currentPhoto}
      />
    </>
  );
}
