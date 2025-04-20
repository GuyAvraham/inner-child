import { useCallback, useMemo, useState } from 'react';
import type { atom } from 'jotai';
import { useAtom } from 'jotai';

import { uriToBlob } from '~/utils/blob';
import { api } from '~/trpc/react';
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
        const photoBlob = await uriToBlob(photo, true);
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
    // await uploadToS3(url, blob);
    const formData = new FormData();
    formData.append('url', url);
    formData.append('file', blob);
    const response = (await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    }).then((resp) => resp.json())) as { status: 'success' | 'fail'; error?: unknown };

    if (response.status === 'success') {
      await saveMetadata({
        age,
        key,
      });

      await utils.photo.invalidate();
    }

    setIsUploading(false);
  }, [age, blob, key, saveMetadata, url, utils.photo]);

  return useMemo(
    () => ({
      photo,
      handlePhoto,
      upload,
      canSubmit: Boolean(url && blob),
      isUploading,
    }),
    [photo, handlePhoto, upload, url, blob, isUploading],
  );
};

export default useHandlePhoto;
