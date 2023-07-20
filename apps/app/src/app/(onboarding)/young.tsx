import { useCallback, useState } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/clerk-expo";

import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";

export default function YoungPhotoScreen() {
  const [photo, setPhoto] = useState<ImagePickerAsset | undefined>();
  const router = useRouter();
  const { user } = useUser();

  const { isSubmitting, submitPhoto } = useSubmitPhoto();

  const handleSubmit = useCallback(async () => {
    if (!photo) return;

    await submitPhoto(photo, "YOUNG");

    await user?.update({
      unsafeMetadata: {
        onboarded: true,
      },
    });

    router.push(ROUTE.HOME.MAIN);
  }, [photo, router, submitPhoto, user]);

  return (
    <>
      <ClerkLoading>
        <Text>Loading...</Text>
      </ClerkLoading>
      <ClerkLoaded>
        <Text>Upload a photo of you as a child</Text>
        <SubmitPhoto onSelect={setPhoto} />
        <Button
          title="generate automatically"
          onPress={async () => {
            // add generation step
            // setPhoto
          }}
        />
        {photo ? (
          <Button
            title={isSubmitting ? "submitting..." : "submit"}
            onPress={handleSubmit}
          />
        ) : null}
      </ClerkLoaded>
    </>
  );
}
