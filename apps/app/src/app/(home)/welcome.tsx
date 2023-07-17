import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/SignOutButton";
import UploadImage from "./uploadImage";

export default function Welcome() {
  const { isSignedIn } = useAuth();

  return (
    <UploadImage />
    // <View className="bg-sky-300 p-6 w-full h-full">
    //   <Text className="text-yellow-400 text-6xl font-bold self-center mt-4">Welcome</Text>
    //   {isSignedIn ? <LogOutButton /> : null}
    // </View>
  );
}
