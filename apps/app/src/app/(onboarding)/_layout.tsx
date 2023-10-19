import { Slot } from 'expo-router';

import { GenerationPhotosContextProvider } from '~/components/onboarding/GenerationPhotosContext';

export default function OnboardingLayout() {
  return (
    <GenerationPhotosContextProvider>
      <Slot />
    </GenerationPhotosContextProvider>
  );
}
