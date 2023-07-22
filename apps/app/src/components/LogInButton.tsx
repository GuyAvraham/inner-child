import { useCallback, useEffect } from "react";
import { Pressable, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

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

  // TODO: figure out why nativewind doesn't work most of the time
  // FIXME: make it generic in case we need other providers
  return (
    <Pressable
      onPress={onPress}
      className="flex flex-row items-center rounded-full border-2 border-black bg-black px-12 py-4"
    >
      <Text className="text-lg text-white">Continue with Google</Text>
    </Pressable>
  );
}
