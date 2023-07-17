import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/SignOutButton";
import UploadImage from "./uploadImage";

export default function Welcome() {
  const { isSignedIn } = useAuth();

  return (
    //<UploadImage />
    <View style={styles.root}>
      <Text style={styles.title}>Welcome</Text>
      {isSignedIn ? <LogOutButton /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#0a1ed6"
  },
  title: {
    alignSelf: "center",
    fontSize: 50,
    fontWeight: "bold",
    color: "#19e3b0"
  }
});
