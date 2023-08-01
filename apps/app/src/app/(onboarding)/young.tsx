import { useCallback } from "react";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";

import { cropToFace } from "~/utils/cropToFace";
import SelectionPhoto from "~/components/SelectionPhoto";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import useUploadPhoto from "~/hooks/useUploadPhoto";
import { currentPhotoAtom, youngPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

export default function YoungPhotoScreen() {
  const router = useRouter();

  const [youngPhoto, setYoungPhoto] = useAtom(youngPhotoAtom);
  const currentPhoto = useAtomValue(currentPhotoAtom);

  const { isUploading, uploadPhoto } = useUploadPhoto();

  const handleSubmit = useCallback(async () => {
    if (!youngPhoto) return;

    await uploadPhoto(youngPhoto, AgeMode.YOUNG);

    router.push(ROUTE.ONBOARDING.GENERATING);
  }, [youngPhoto, uploadPhoto, router]);

  return (
    <>
      <Text>Upload a photo of you as a child</Text>
      <SelectionPhoto
        source={youngPhoto ? { uri: youngPhoto } : { uri: currentPhoto }}
        blurRadius={!youngPhoto ? 100 : 0}
      />
      <SubmitPhoto
        onSelect={(photo) => {
          void cropToFace(photo.uri).then((result) => {
            setYoungPhoto(result.uri);
          });
        }}
      />
      <Button
        title="generate automatically"
        onPress={() => {
          router.push({
            pathname: ROUTE.ONBOARDING.GENERATING,
            params: { young: true },
          });
        }}
      />
      <Button
        title={isUploading ? "submitting..." : "submit"}
        onPress={handleSubmit}
        disabled={!youngPhoto}
      />
    </>
  );
}
