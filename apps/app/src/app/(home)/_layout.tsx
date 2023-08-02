import { Dimensions, View } from "react-native";
import { Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/LogOutButton";

export default function HomeLayout() {
  const { isSignedIn } = useAuth();

  return (
    <View
      className="grid grid-rows-2 overflow-hidden"
      style={{ height: Dimensions.get("window").height }}
    >
      {isSignedIn ? <LogOutButton /> : null}
      <Slot />
    </View>
  );
}
