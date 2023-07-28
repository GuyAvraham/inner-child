import { useCallback, useState } from "react";
import type { ImagePickerAsset } from "expo-image-picker";

import { raise } from "@innch/utils";

import { api } from "~/utils/api";
import type { AgeMode } from "~/types";

const useUploadPhoto = () => {
  const [isUploading, setIsUploading] = useState(false);

  const photoAPI = api.photo.upload.useMutation();

  const uploadPhoto = useCallback(
    async (photo: ImagePickerAsset, age: AgeMode) => {
      setIsUploading(true);

      const uploadedPhoto = await photoAPI.mutateAsync({
        age,
        photoURI: `data:image/jpeg;base64,${
          photo.base64 ?? raise("Bad file reading")
        }`,
      });

      console.log(uploadedPhoto);

      setIsUploading(false);
    },
    [photoAPI],
  );

  return {
    isUploading,
    uploadPhoto,
  };
};

export default useUploadPhoto;
