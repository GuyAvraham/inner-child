import { Slot, usePathname } from 'expo-router';

import { GenerationPhotosContextProvider } from '~/components/onboarding/GenerationPhotosContext';

export default function OnboardingLayout() {
  const pathname = usePathname();

  if (pathname === '/current') {
    return <Slot />;
  }

  return (
    <GenerationPhotosContextProvider>
      <Slot />
    </GenerationPhotosContextProvider>
  );
}
