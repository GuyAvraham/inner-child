import { useCallback, useEffect } from "react";
import { Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

import useErrorsHandler from "~/hooks/useErrorsHandler";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LogInButton() {
  const { handleError } = useErrorsHandler();

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive?.({ session: createdSessionId }).catch(handleError);
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (error) {
      handleError(error);
    }
  }, [handleError, startOAuthFlow]);

  return (
    <Pressable onPress={onPress}>
      <FontAwesome name="google" size={24} color="black" />
    </Pressable>
  );
}
