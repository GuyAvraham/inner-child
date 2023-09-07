import { useCallback, useEffect, useState } from 'react';

import { api } from '~/utils/api';
import { blobToUri, uriToBlob } from '~/utils/blob';
import { Age } from '~/types';

export const useGenerateAgedPhotos = ({ old, young }: { old: boolean; young: boolean }) => {
  const [youngPredictionId, setYoungPredictionId] = useState<string | null>(null);
  const [oldPredictionId, setOldPredictionId] = useState<string | null>(null);

  const [youngPhoto, setYoungPhoto] = useState<string | undefined>(undefined);
  const [oldPhoto, setOldPhoto] = useState<string | undefined>(undefined);

  const { mutateAsync: generateAged } = api.photo.generateAged.useMutation();

  const refetchInterval = 2000;
  const { data: youngPhotoURI } = api.photo.wait.useQuery(
    { predictionId: youngPredictionId! },
    { enabled: young && !!youngPredictionId, refetchInterval },
  );
  const { data: oldPhotoURI } = api.photo.wait.useQuery(
    { predictionId: oldPredictionId! },
    { enabled: old && !!oldPredictionId, refetchInterval },
  );

  useEffect(() => {
    if (!youngPhotoURI) return;
    void uriToBlob(youngPhotoURI).then(blobToUri).then(setYoungPhoto);
  }, [youngPhotoURI]);

  useEffect(() => {
    if (!oldPhotoURI) return;
    void uriToBlob(oldPhotoURI).then(blobToUri).then(setOldPhoto);
  }, [oldPhotoURI]);

  const generate = useCallback(async () => {
    const youngPrediction = await generateAged({ age: Age.Young });
    setYoungPredictionId(youngPrediction.id);

    const oldPrediction = await generateAged({ age: Age.Old });
    setOldPredictionId(oldPrediction.id);
  }, [generateAged]);

  useEffect(() => {
    void generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { youngPhoto, oldPhoto };
};
