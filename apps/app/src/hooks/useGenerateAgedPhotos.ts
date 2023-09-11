import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '~/utils/api';
import { Age } from '~/types';

export const useGenerateAgedPhotos = ({ old, young }: { old: boolean; young: boolean }) => {
  const [youngPredictionId, setYoungPredictionId] = useState<string | null>(null);
  const [oldPredictionId, setOldPredictionId] = useState<string | null>(null);
  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();

  const refetchInterval = 2000;
  const { data: youngPhoto } = api.photo.wait.useQuery(
    { predictionId: youngPredictionId! },
    { enabled: young && !!youngPredictionId, refetchInterval },
  );
  const { data: oldPhoto } = api.photo.wait.useQuery(
    { predictionId: oldPredictionId! },
    { enabled: old && !!oldPredictionId, refetchInterval },
  );

  const generate = useCallback(() => {
    void generateAged({ age: Age.Young }).then(({ id }) => setYoungPredictionId(id));
    void generateAged({ age: Age.Old }).then(({ id }) => setOldPredictionId(id));
  }, [generateAged]);

  useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => ({ youngPhoto, oldPhoto }), [youngPhoto, oldPhoto]);
};
