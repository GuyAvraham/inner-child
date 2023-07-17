import { StyleSheet, Text, View } from "react-native";

import LogInButton from "~/components/LogInButton";

export default function Login() {
  return (
    <View style={styles.root}>
      
      <Text style={styles.title}>Inner Child</Text>
      <Text style={styles.description}>Reconnect with your inner</Text>
      <View style={styles.buttonContainer}>
        <LogInButton />
      </View>
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
  },
  description: {
    alignSelf: "center",
    fontSize: 18,
    color: "#fff"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end"
  }
});