import { Slot } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import LogOutButton from "~/components/LogOutButton";
import { GPTProvider } from "~/utils/gpt";

export default function HomeLayout() {
  const { isSignedIn } = useAuth();
  return (
    <>
      {isSignedIn ? <LogOutButton /> : null}
      <GPTProvider>
        <Slot />
      </GPTProvider>      
    </>
  );
}
