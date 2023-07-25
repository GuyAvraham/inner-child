import { useState } from "react";
import type { ImagePickerAsset } from "expo-image-picker";

import { trpc } from "~/utils/api";
import { uploadFileToS3 } from "~/utils/uploadFileToS3";
import type { AgeMode } from "~/types";

export const useSubmitPhoto = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: getUploadURI } = trpc.picture.getUploadURI.useMutation();

  const submitPhoto = async (photo: ImagePickerAsset, age: AgeMode) => {
    setIsSubmitting(true);

    const photoBlob = await (await fetch(photo.uri)).blob();

    const uriToUpload = await getUploadURI({
      age,
      ext: photoBlob.type.split("/")[1] ?? "jpeg",
    });

    await uploadFileToS3(uriToUpload, photoBlob);

    setIsSubmitting(false);
  };

  return { isSubmitting, submitPhoto };
};
