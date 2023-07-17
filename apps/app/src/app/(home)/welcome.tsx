import { Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/SignOutButton";

export default function Welcome() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Text>Welcome</Text>
      {isSignedIn ? <LogOutButton /> : null}
    </>
  );
}
