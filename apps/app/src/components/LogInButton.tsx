import { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';

import useErrorHandler from '~/hooks/useErrorHandler';
import Button from './ui/Button';

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
  const { handleError } = useErrorHandler();

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (error) {
      handleError(error);
    }
  }, [handleError, startOAuthFlow]);

  return (
    <Button onPress={onPress}>
      <Button.Text>Continue with Google</Button.Text>
    </Button>
  );
}
