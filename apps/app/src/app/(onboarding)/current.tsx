import { useCallback, useState } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";

import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";

export default function CurrentPhotoScreen() {
  const [photo, setPhoto] = useState<ImagePickerAsset | undefined>();
  const router = useRouter();

  const { isSubmitting, submitPhoto } = useSubmitPhoto();

  const handleSubmit = useCallback(async () => {
    if (!photo) return;

    await submitPhoto(photo, "CURRENT");

    router.push(ROUTE.ONBOARDING.YOUNG);
  }, [photo, router, submitPhoto]);

  return (
    <>
      <Text>Take or upload a photo against plain surface</Text>
      <SubmitPhoto
        enableCamera
        onSelect={(croppedPhoto) => {
          setPhoto(croppedPhoto);
        }}
      />
      {photo ? (
        <Button
          title={isSubmitting ? "submitting..." : "submit"}
          onPress={handleSubmit}
        />
      ) : null}
    </>
  );
}
