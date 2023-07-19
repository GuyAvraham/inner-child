import { Text } from "react-native";
import { Redirect } from "expo-router";

import { trpc } from "~/utils/api";
import { ROUTE } from "~/config/routes";

export default function Index() {
  const { data: pictures, isLoading } = trpc.picture.getAll.useQuery(
    undefined,
    { staleTime: 5 },
  );

  if (isLoading) return <Text>Loading...</Text>;
  // console.log({ pictures: JSON.stringify(pictures, null, 2), isLoading });

  // console.log(
  //   (pictures?.find((picture) => picture.age === "CURRENT") &&
  //     pictures?.find((picture) => picture.age === "YOUNG")) ||
  //     false,
  // );
  if (
    (pictures?.find((picture) => picture.age === "CURRENT") &&
      pictures?.find((picture) => picture.age === "YOUNG")) ||
    false
  ) {
    console.log("rerouting to main");
    return <Redirect href={ROUTE.HOME.MAIN} />;
  }

  console.log("rerouting to welcome");

  return <Redirect href={ROUTE.ONBOARDING.WELCOME} />;
}
