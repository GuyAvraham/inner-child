import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { SplashScreen } from 'expo-router';

import { Redirect } from '~/components/common/Redirect';
import { ROUTES } from '~/config/routes';
import useUserData from '~/hooks/useUserData';
import { Onboarded } from '~/types';

const onboardingMap: Record<string, ReactElement> = {
  current: <Redirect href={ROUTES.ONBOARDING.CURRENT} />,
  generateYoung: <Redirect href={ROUTES.ONBOARDING.GENERATE_YOUNG} />,
  generateOld: <Redirect href={ROUTES.ONBOARDING.GENERATE_OLD} />,
};

export default function Index() {
  const { data, isLoaded } = useUserData();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  if (!data.onboarded) return <Redirect href={ROUTES.ONBOARDING.CURRENT} />;

  if (data.onboarded !== Onboarded.Finished) {
    return onboardingMap[data.onboarded as string];
  }

  return <Redirect href={ROUTES.HOME.INDEX} />;
}
