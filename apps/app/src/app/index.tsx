import type { ReactElement } from 'react';
import { View } from 'react-native';

import { AnimatedProgress } from '~/components/AnimatedProgress';
import { Redirect } from '~/components/common/Redirect';
import { ROUTES } from '~/config/routes';
import useUserData from '~/hooks/useUserData';
import { Onboarded } from '~/types';

const onboardingMap: Record<string, ReactElement> = {
  current: <Redirect href={ROUTES.ONBOARDING.CURRENT} />,
  generate: <Redirect href={ROUTES.ONBOARDING.GENERATE} />,
};

export default function Index() {
  const { data, isLoaded } = useUserData();

  if (!isLoaded) {
    return (
      <View className="h-full items-center justify-center">
        <AnimatedProgress fast />
      </View>
    );
  }

  if (!data.onboarded) return <Redirect href={ROUTES.ONBOARDING.CURRENT} />;

  if (data.onboarded !== Onboarded.Finished) {
    return onboardingMap[data.onboarded as string];
  }

  return <Redirect href={ROUTES.HOME.INDEX} />;
}
