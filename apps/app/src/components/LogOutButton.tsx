import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function LogOutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable
      className="flex flex-row items-center gap-2 p-2"
      onPress={async () => {
        await signOut();
      }}
    >
      <SimpleLineIcons name="logout" size={24} color="black" />
      <Text>Sign Out </Text>
    </Pressable>
  );
}
