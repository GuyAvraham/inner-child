import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import { api } from "~/utils/api";
import { ROUTE } from "~/config/routes";

export default function DEV_Resets() {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();

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
  }, [deletePhotos, router, user]);

  return isSignedIn ? (
    <>
      <Pressable onPress={DEV_resetProfile}>
        <Text>DEV Reset Profile</Text>
      </Pressable>
      <Pressable onPress={DEV_resetPhotos}>
        <Text>DEV Reset Photos</Text>
      </Pressable>
    </>
  ) : null;
}
