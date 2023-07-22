import { useCallback } from "react";
import { Button, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/clerk-expo";
import { useAtom, useAtomValue } from "jotai";

import { replicate } from "~/utils/replicate";
import SubmitPhoto from "~/components/SelectPhoto";
import { ROUTE } from "~/config/routes";
import { useSubmitPhoto } from "~/hooks/useSavePhoto";
import { photoAtom, youngPhotoAtom } from "~/store/photos";

const generateYoungPhoto = async (
  photo: ImagePickerAsset,
): Promise<ImagePickerAsset> => {
  try {
    const result = await replicate.run(
      "yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
      {
        input: {
          image: photo.uri,
          target_age: 10,
        },
      },
    );

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.error(error);
  }
  return photo;
};

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
            const youngPhoto = await generateYoungPhoto(photo!);
            setYoungPhoto(youngPhoto);
          }}
        />
        <Button
          title={isSubmitting ? "submitting..." : "submit"}
          onPress={handleSubmit}
          disabled={!youngPhoto}
        />
      </ClerkLoaded>
    </>
  );
}
