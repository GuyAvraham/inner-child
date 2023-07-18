import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function LogOutButton() {
  const { signOut, isLoaded } = useAuth();

  return isLoaded ? (
    <Pressable
      onPress={() => {
        signOut().catch(console.error);
      }}
    >
      <Text>Sign Out </Text>
    </Pressable>
  ) : // TODO: handle loading state
  null;
}
