import { useCallback } from "react";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import SelectionPhoto from "~/components/SelectionPhoto";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import useUploadPhoto from "~/hooks/useUploadPhoto";
import { currentPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

export default function CurrentPhotoScreen() {
  const router = useRouter();

  const [photo, setPhoto] = useAtom(currentPhotoAtom);

  const { isUploading, uploadPhoto } = useUploadPhoto();

  const handleSubmit = useCallback(async () => {
    if (!photo) return;

    await uploadPhoto(photo, AgeMode.CURRENT);

    router.push(ROUTE.ONBOARDING.YOUNG);
  }, [photo, router, uploadPhoto]);

  return (
    <>
      <Text>Take or upload a photo against plain surface</Text>
      <SelectionPhoto photo={photo} />
      <SubmitPhoto
        enableCamera
        onSelect={(croppedPhoto) => {
          setPhoto(croppedPhoto);
        }}
      />
      <Button
        title={isUploading ? "submitting..." : "submit"}
        onPress={handleSubmit}
        disabled={!photo}
      />
    </>
  );
}
