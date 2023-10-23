import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '~/utils/api';
import { Age } from '~/types';
import useUserData from './useUserData';

const refetchInterval = 4000;

export const useGenerateAgedPhotos = () => {
  const { data, user: userData } = useUserData();

  const [youngPredictionIds, setYoungPredictionIds] = useState<string[]>([]);
  const [oldPredictionIds, setOldPredictionIds] = useState<string[]>([]);

  const [youngPhotos, setYoungPhotos] = useState<(string | null)[]>([]);
  const [oldPhotos, setOldPhotos] = useState<(string | null)[]>([]);

  const { data: currentPhoto } = api.photo.getByAge.useQuery({ age: 'current' });
  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();
  const { mutateAsync: waitPhoto } = api.photo.wait.useMutation();
  const { data: dataFromGame } = api.photo.getPhotosFromGame.useQuery({
    email: userData?.emailAddresses[0]?.emailAddress ?? '',
  });

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

  useEffect(() => {
    if (currentPhoto) {
      void generate();
    }
  }, [currentPhoto, generate]);

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
          if (typeof result === 'number') {
            setYoungPredictionIds((prev) => prev.filter((item) => item !== predictionId));
            continue;
          }
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
          if (typeof result === 'number') {
            setOldPredictionIds((prev) => prev.filter((item) => item !== predictionId));
            continue;
          }
          results.push(result);
        }

        setOldPhotos(results);
      })();
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [oldPredictionIds, oldPhotos, waitPhoto]);

  return useMemo(() => {
    let photos = youngPhotos.slice();

    if (dataFromGame?.photos) {
      photos = [...dataFromGame.photos, ...youngPhotos];
    }

    return { youngPhotos: photos, oldPhotos, presetCount: dataFromGame?.photos?.length ?? 0 };
  }, [youngPhotos, oldPhotos, dataFromGame]);
};
