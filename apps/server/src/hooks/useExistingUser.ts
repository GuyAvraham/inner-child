import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '~/utils/api';
import { Age } from '~/types';

export const useExistingUser = () => {
  const router = useRouter();
  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });

  useEffect(() => {
    if (!isOldLoading && oldPhoto?.uri) {
      router.replace('/chat');
    }
  }, [isOldLoading, oldPhoto?.uri, router]);

  return isOldLoading || !!oldPhoto?.uri;
};
