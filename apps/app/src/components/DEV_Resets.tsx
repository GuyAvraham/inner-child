import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSetAtom } from "jotai";

import { api, getApiUrl } from "~/utils/api";
import { ROUTE } from "~/config/routes";
import {
  currentPhotoAtom,
  oldPhotoAtom,
  originalPhotoAtom,
  youngPhotoAtom,
} from "~/store/photos";

export default function DEV_Resets() {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();

  const setOriginalPhoto = useSetAtom(originalPhotoAtom);
  const setCurrentPhoto = useSetAtom(currentPhotoAtom);
  const setYoungPhoto = useSetAtom(youngPhotoAtom);
  const setOldPhoto = useSetAtom(oldPhotoAtom);

  const router = useRouter();

  const { mutateAsync: deletePhotos } = api.photo.deleteAll.useMutation();

  const DEV_resetProfile = useCallback(async () => {
    await user?.delete();

    await signOut();
  }, [signOut, user]);

  const DEV_resetPhotos = useCallback(async () => {
    await deletePhotos();

    await user?.update({
      unsafeMetadata: {
        onboarded: false,
      },
    });

    router.replace(ROUTE.ONBOARDING.CURRENT);

    setOriginalPhoto(undefined);
    setCurrentPhoto(undefined);
    setYoungPhoto(undefined);
    setOldPhoto(undefined);
  }, [
    deletePhotos,
    router,
    setCurrentPhoto,
    setOldPhoto,
    setOriginalPhoto,
    setYoungPhoto,
    user,
  ]);

  return isSignedIn ? (
    <>
      <Text>{getApiUrl()}</Text>
      <Pressable onPress={DEV_resetProfile}>
        <Text>DEV Reset Profile</Text>
      </Pressable>
      <Pressable onPress={DEV_resetPhotos}>
        <Text>DEV Reset Photos</Text>
      </Pressable>
    </>
  ) : null;
}
