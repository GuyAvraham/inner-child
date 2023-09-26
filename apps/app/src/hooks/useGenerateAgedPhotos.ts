import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '~/utils/api';
import { Age } from '~/types';
import useUserData from './useUserData';

const refetchInterval = 4000;

export const useGenerateAgedPhotos = () => {
  const { data } = useUserData();

  const [youngPredictionIds, setYoungPredictionIds] = useState<string[]>([]);
  const [oldPredictionIds, setOldPredictionIds] = useState<string[]>([]);

  const [youngPhotos, setYoungPhotos] = useState<(string | null)[]>([]);
  const [oldPhotos, setOldPhotos] = useState<(string | null)[]>([]);

  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();
  const { mutateAsync: waitPhoto } = api.photo.wait.useMutation();

  const generate = useCallback(() => {
    const gender = data.gender as 'male' | 'female';
    void generateAged({ age: Age.Young, gender }).then((predictions) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setYoungPredictionIds(predictions.map((prediction) => prediction.value?.id as string));
    });
    void generateAged({ age: Age.Old, gender }).then((predictions) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setOldPredictionIds(predictions.map((prediction) => prediction.value?.id as string));
    });
  }, [generateAged, data.gender]);

  useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (youngPhotos.length && youngPhotos.every((item) => typeof item === 'string')) {
      console.log('all young photos are completed');
      return;
    }

    const interval = setInterval(() => {
      void (async () => {
        const results = [] as (string | null)[];
        for await (const predictionId of youngPredictionIds) {
          const result = await waitPhoto({ predictionId });
          results.push(result);
        }

        setYoungPhotos(results);
      })();
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [youngPredictionIds, youngPhotos, waitPhoto]);

  useEffect(() => {
    if (oldPhotos.length && oldPhotos.every((item) => typeof item === 'string')) {
      console.log('all old photos are completed');
      return;
    }

    const interval = setInterval(() => {
      void (async () => {
        const results = [] as (string | null)[];
        for await (const predictionId of oldPredictionIds) {
          const result = await waitPhoto({ predictionId });
          results.push(result);
        }

        setOldPhotos(results);
      })();
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [oldPredictionIds, oldPhotos, waitPhoto]);

  return useMemo(() => ({ youngPhotos, oldPhotos }), [youngPhotos, oldPhotos]);
};
