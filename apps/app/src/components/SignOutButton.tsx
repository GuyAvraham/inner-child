import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function LogOutButton() {
  const { signOut, isLoaded } = useAuth();

  return isLoaded ? (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        signOut();
      }}
    >
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  ) : // TODO: handle loading state
  null;
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    padding: 12.5,
    paddingHorizontal: 45,
    backgroundColor: "#ff346a",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  text: {
    fontSize: 25,
  }
});