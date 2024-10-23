import { useEffect } from 'react';

import type { Onboarded } from '~/types';
import useUserData from './useUserData';

const useOnboardedScreen = (onboarded: Onboarded) => {
  const { updateUserData } = useUserData();

  useEffect(() => {
    void updateUserData({ onboarded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOnboardedScreen;
