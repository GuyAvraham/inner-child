import { useCallback, useEffect, useState } from 'react';

import { api } from '~/utils/api';
import type { Age } from '~/types';
import useUserData from './useUserData';

const refetchInterval = 4000;

export const useGenerateAgedPhotos = (age: Age) => {
  const { data } = useUserData();
  const gender = data.gender as 'male' | 'female';

  const [predictionIds, setPredictionIds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);

  const { data: currentPhoto } = api.photo.getByAge.useQuery({ age: 'current' });
  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();
  const { mutateAsync: waitPhoto } = api.photo.wait.useMutation();

  const generate = useCallback(() => {
    void generateAged({ age, gender }).then((predictions) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setPredictionIds(predictions.map((prediction) => prediction.value?.id as string));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentPhoto) void generate();
  }, [currentPhoto]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (photos.length && photos.every((item) => typeof item === 'string')) {
      console.log(`All ${age} photos are generated!`);
      return;
    }

    const interval = setInterval(() => {
      void (async () => {
        const results = [] as (string | null)[];
        for await (const predictionId of predictionIds) {
          const result = await waitPhoto({ predictionId });
          // Checking that result is a number, if so, it means that the prediction is FAILED
          if (typeof result === 'number') {
            // remove the failed prediction from the list
            setPredictionIds((prev) => prev.filter((item) => item !== predictionId));
            continue;
          }
          results.push(result);
        }

        if (predictionIds.length) {
          setPhotos((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(results)) {
              return prev;
            }

            return results;
          });
        }
      })();
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [predictionIds, photos, waitPhoto]); // eslint-disable-line react-hooks/exhaustive-deps

  return photos;
};
