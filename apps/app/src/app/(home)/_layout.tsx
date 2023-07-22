import { Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/LogOutButton";

export default function HomeLayout() {
  const { isSignedIn } = useAuth();
  return (
    <>
      {isSignedIn ? <LogOutButton /> : null}
      <Slot />
    </>
  );
}
