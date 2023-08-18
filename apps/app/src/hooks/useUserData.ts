import { useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';

const useUserData = () => {
  const { user, ...everything } = useUser();

  const updateUserData = useCallback(
    async (data: Record<string, unknown>) => {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          ...data,
        },
      });
    },
    [user],
  );

  return {
    user,
    data: user?.unsafeMetadata ?? {},
    updateUserData,
    ...everything,
  };
};

export default useUserData;
