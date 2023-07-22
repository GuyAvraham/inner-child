import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function LogOutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable
      onPress={async () => {
        await signOut();
      }}
    >
      <Text>Sign Out </Text>
    </Pressable>
  );
}
