import { useCallback } from "react";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/clerk-expo";
import { useAtom } from "jotai";

import SelectionPhoto from "~/components/SelectionPhoto";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import useUploadPhoto from "~/hooks/useUploadPhoto";
import { youngPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

export default function YoungPhotoScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [youngPhoto, setYoungPhoto] = useAtom(youngPhotoAtom);

  const { isUploading, uploadPhoto } = useUploadPhoto();

  const handleSubmit = useCallback(async () => {
    if (!youngPhoto) return;

    await uploadPhoto(youngPhoto, AgeMode.YOUNG);

    await user?.update({
      unsafeMetadata: {
        onboarded: true,
      },
    });

    router.push(ROUTE.HOME.MAIN);
  }, [youngPhoto, uploadPhoto, user, router]);

  return (
    <>
      <ClerkLoading>
        <Text>Loading...</Text>
      </ClerkLoading>
      <ClerkLoaded>
        <Text>Upload a photo of you as a child</Text>
        <SelectionPhoto photo={youngPhoto} />
        <SubmitPhoto onSelect={setYoungPhoto} />
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
      </ClerkLoaded>
    </>
  );
}
