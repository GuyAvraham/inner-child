import { useCallback, useState } from "react";
import { randomUUID } from "expo-crypto";

import { api } from "~/utils/api";
import { uploadFileToS3 } from "~/utils/uploadFileToS3";
import type { AgeMode } from "~/types";

const useUploadPhoto = () => {
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: getUploadURL } = api.upload.getURL.useMutation();
  const { mutateAsync: createDBRecord } = api.photo.create.useMutation();

  const uploadPhoto = useCallback(
    async (photoURI: string, age: AgeMode) => {
      setIsUploading(true);

      const key = `${age}-${randomUUID().split("-")[0]}.jpeg`;

      const uploadURL = await getUploadURL({ key });
      alert("got the url " + uploadURL);

      await uploadFileToS3(
        uploadURL,
        await (await fetch(photoURI)).blob(),
      ).catch((error) => alert((error as Error).message ?? error));
      alert("uploaded photo " + key);

      await createDBRecord({
        age,
        key,
      });
      alert("saved photo " + key);

      setIsUploading(false);
    },
    [createDBRecord, getUploadURL],
  );

  return {
    isUploading,
    uploadPhoto,
  };
};

export default useUploadPhoto;
