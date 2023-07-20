import { Text } from "react-native";
import { Link } from "expo-router";

import { ROUTE } from "~/config/routes";

export default function Welcome() {
  return (
    <>
      <Text>Welcome</Text>

      <Link href={ROUTE.ONBOARDING.CURRENT}>upload your first photo</Link>
    </>
  );
}
