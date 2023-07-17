import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function LogOutButton() {
  const { signOut, isLoaded } = useAuth();

  return isLoaded ? (
    <TouchableOpacity
      className="flex-row p-3 px-10 bg-red-500 self-center items-center justify-center rounded-3xl"
      onPress={() => {
        signOut();
      }}
    >
      <Text className="text-2xl text-white">Sign Out</Text>
    </TouchableOpacity>
  ) : // TODO: handle loading state
  null;
}
