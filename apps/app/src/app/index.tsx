import { Redirect } from "expo-router";

import { ROUTE } from "~/config/routes";

export default function Index() {
  // TODO: add logic for handling new users
  return <Redirect href={ROUTE.HOME.WELCOME} />;
}
