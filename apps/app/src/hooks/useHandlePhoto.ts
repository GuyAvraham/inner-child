import { useCallback, useState } from 'react';
import type { atom } from 'jotai';
import { useAtom } from 'jotai';

import { api } from '~/utils/api';
import { uriToBlob } from '~/utils/blob';
import { uploadToS3 } from '~/utils/uploadToS3';
import type { Age } from '~/types';

const useHandlePhoto = (age: Age | 'current', photoAtom: ReturnType<typeof atom<string | undefined>>) => {
  const [photo, setPhoto] = useAtom(photoAtom);

  const [key, setKey] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [blob, setBlob] = useState<Blob>();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const utils = api.useContext();

  const { mutateAsync: getUploadURL } = api.upload.getURL.useMutation();
  const { mutateAsync: saveMetadata } = api.photo.create.useMutation();

  const handlePhoto = useCallback(
    async (photo: string) => {
      setKey(undefined);
      setUrl(undefined);
      setBlob(undefined);
      setPhoto(photo);

      try {
        const photoBlob = await uriToBlob(photo);
        const key = `${age}-${Date.now()}.${photoBlob?.type.split('/').at(1) ?? 'jpeg'}`;

        const url = await getUploadURL({ key });

        setKey(key);
        setUrl(url);
        setBlob(photoBlob);
      } catch (error) {
        alert(error);
      }
    },
    [age, getUploadURL, setPhoto],
  );

  const upload = useCallback(async () => {
    if (!key || !url || !blob) return;

    setIsUploading(true);
    await uploadToS3(url, blob);
    await saveMetadata({
      age,
      key,
    });

    await utils.photo.invalidate();

    setIsUploading(false);
  }, [age, blob, key, saveMetadata, url, utils.photo]);

  return {
    photo,
    handlePhoto,
    upload,
    canSubmit: Boolean(url && blob),
    isUploading,
  };
};

export default useHandlePhoto;
