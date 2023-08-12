import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function DEV_ResetProfile() {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();

  const DEV_resetProfile = useCallback(async () => {
    await user?.delete();

    await signOut();
  }, [signOut, user]);

  return isSignedIn ? (
    <Pressable onPress={DEV_resetProfile}>
      <Text>DEV Reset Profile</Text>
    </Pressable>
  ) : null;
}
