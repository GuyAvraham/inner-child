import type { ReactElement } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Redirect } from '~/components/common/Redirect';
import Text from '~/components/ui/Text';
import { ROUTES } from '~/config/routes';
import useUserData from '~/hooks/useUserData';

const onboardingMap: Record<string, ReactElement> = {
  current: <Redirect href={ROUTES.ONBOARDING.CURRENT} />,
  young: <Redirect href={ROUTES.ONBOARDING.YOUNG} />,
  generate: <Redirect href={ROUTES.ONBOARDING.GENERATE} />,
};

export default function Index() {
  const { data, isLoaded } = useUserData();

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex h-full w-full items-center justify-center font-[Poppins]">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!data.onboarded) return <Redirect href={ROUTES.ONBOARDING.CURRENT} />;

  if (data.onboarded !== 'finished') {
    return onboardingMap[data.onboarded as string];
  }

  return <Redirect href={ROUTES.HOME.INDEX} />;
}
