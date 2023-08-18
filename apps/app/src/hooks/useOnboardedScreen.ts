import { useEffect } from 'react';

import useUserData from './useUserData';

const useOnboardedScreen = (
  onboarded: 'current' | 'young' | 'generate' | 'finished',
) => {
  const { updateUserData } = useUserData();

  useEffect(() => {
    void updateUserData({ onboarded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useOnboardedScreen;
