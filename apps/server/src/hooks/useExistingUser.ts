import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { api } from '~/utils/api';
import { Age } from '~/types';

export const useExistingUser = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });

  useLayoutEffect(() => {
    if (!isOldLoading && oldPhoto?.uri && user?.unsafeMetadata?.gender) {
      router.replace('/chat');
    }
  }, [isOldLoading, oldPhoto?.uri, router, user?.unsafeMetadata?.gender]);

  return isOldLoading || !!oldPhoto?.uri;
};
