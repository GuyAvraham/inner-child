import { Text } from "react-native";
import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { ROUTE } from "~/config/routes";

export default function Index() {
  const { isLoaded, user } = useUser();

  if (!isLoaded && !user) return <Text>Loading...</Text>;

  if (user?.unsafeMetadata.onboarded) {
    console.log("rerouting to main");
    return <Redirect href={ROUTE.HOME.MAIN} />;
  }

  console.log("rerouting to welcome");

  return <Redirect href={ROUTE.HOME.MAIN} />;//return <Redirect href={ROUTE.ONBOARDING.CURRENT} />;
}
