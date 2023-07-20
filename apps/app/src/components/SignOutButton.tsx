import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import useErrorsHandler from "~/hooks/useErrorsHandler";

export default function LogOutButton() {
  const { handleError } = useErrorsHandler();

  const { signOut, isLoaded } = useAuth();

  return isLoaded ? (
    <Pressable
      onPress={() => {
        signOut().catch(handleError);
      }}
    >
      <Text>Sign Out </Text>
    </Pressable>
  ) : // TODO: handle loading state
  null;
}
