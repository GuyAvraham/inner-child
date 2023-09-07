import { useCallback } from 'react';
import { View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';

import useErrorHandler from '~/hooks/useErrorHandler';
import { useWarmUpBrowser } from '~/hooks/useWarmUpBrowser';
import { GoogleSVG } from '~/svg/google';
import Button from './ui/Button';

WebBrowser.maybeCompleteAuthSession();

export default function LogInButton() {
  useWarmUpBrowser();
  const { handleError } = useErrorHandler();
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
    <Button transparent onPress={onPress}>
      <GoogleSVG />
      <View className="w-3" />
      <Button.Text>Continue with Google</Button.Text>
    </Button>
  );
}
