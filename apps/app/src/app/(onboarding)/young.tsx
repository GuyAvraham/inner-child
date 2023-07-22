import { useCallback } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/clerk-expo";
import { useAtom, useAtomValue } from "jotai";

import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";
import { photoAtom, youngPhotoAtom } from "~/store/photos";

export default function YoungPhotoScreen() {
  const router = useRouter();
  const { user } = useUser();

  const photo = useAtomValue(photoAtom);
  const [youngPhoto, setYoungPhoto] = useAtom(youngPhotoAtom);

  const { isSubmitting, submitPhoto } = useSubmitPhoto();

  const handleSubmit = useCallback(async () => {
    if (!youngPhoto) return;

    await submitPhoto(youngPhoto, "YOUNG");

    await user?.update({
      unsafeMetadata: {
        onboarded: true,
      },
    });

    router.push(ROUTE.HOME.MAIN);
  }, [router, submitPhoto, user, youngPhoto]);

  return (
    <>
      <ClerkLoading>
        <Text>Loading...</Text>
      </ClerkLoading>
      <ClerkLoaded>
        <Text>Upload a photo of you as a child</Text>
        <SubmitPhoto onSelect={setYoungPhoto} />
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
