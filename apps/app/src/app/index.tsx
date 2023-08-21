import type { ReactElement } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';

import Text from '~/components/ui/Text';
import useUserData from '~/hooks/useUserData';

const onboardingMap: Record<string, ReactElement> = {
  current: <Redirect href={'/(onboarding)/current'} />,
  young: <Redirect href={'/(onboarding)/young'} />,
  generate: <Redirect href={'/(onboarding)/generate'} />,
};

const Index = () => {
  const { data, isLoaded } = useUserData();

  if (!isLoaded)
    return (
      <SafeAreaView className="flex h-full w-full items-center justify-center font-[Poppins]">
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (!data.onboarded) return <Redirect href={'/(onboarding)/current'} />;

  if (data.onboarded !== 'finished')
    return onboardingMap[data.onboarded as string];

  return <Redirect href={'/(home)'} />;
};

export default Index;
