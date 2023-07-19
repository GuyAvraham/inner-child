import { Button, Text } from "react-native";
import { useRouter } from "expo-router";

import { ROUTE } from "~/config/routes";

export default function NotFound() {
  const { replace } = useRouter();
  return (
    <>
      <Text>You&apos;re not supposed to be here</Text>
      <Button
        title="go home"
        onPress={() => {
          replace(ROUTE.ROOT);
        }}
      />
    </>
  );
}
