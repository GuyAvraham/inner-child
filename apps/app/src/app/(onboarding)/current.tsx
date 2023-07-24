import { useCallback } from "react";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import SelectionPhoto from "~/components/SelectionPhoto";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";
import { photoAtom } from "~/store/photos";

export default function CurrentPhotoScreen() {
  const router = useRouter();

  const [photo, setPhoto] = useAtom(photoAtom);

  const { isSubmitting, submitPhoto } = useSubmitPhoto();

  const handleSubmit = useCallback(async () => {
    if (!photo) return;

    await submitPhoto(photo, "CURRENT");

    router.push(ROUTE.ONBOARDING.YOUNG);
  }, [photo, router, submitPhoto]);

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
        title={isSubmitting ? "submitting..." : "submit"}
        onPress={handleSubmit}
        disabled={!photo}
      />
    </>
  );
}
