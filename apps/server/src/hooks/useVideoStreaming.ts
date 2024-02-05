import { useEffect } from 'react';

import { api } from '~/utils/api';
import type { Age } from '~/types';

export function useVideoStreaming(age: Age) {
  const { data: userPhoto } = api.photo.getByAge.useQuery({ age });

  useEffect(() => {
    if (!userPhoto) return;
  }, [userPhoto]);
}
