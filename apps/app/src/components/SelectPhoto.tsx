import { useCallback, useState } from "react";
import { Button, Image } from "react-native";
import { detectFacesAsync, FaceDetectorMode } from "expo-face-detector";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import type { ImagePickerAsset, ImagePickerOptions } from "expo-image-picker";

import useErrorsHandler from "~/hooks/useErrorsHandler";

const mediaOptions: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  aspect: [1, 1],
  quality: 1,
  base64: true,
  exif: true,
};

export default function SubmitPhoto({
  enableCamera = false,
  onSelect,
}: {
  enableCamera?: boolean;
  onSelect: (photo: ImagePickerAsset) => void;
}) {
  const [photo, setPhoto] = useState<ImagePickerAsset>();
  const [croppedPhoto, setCroppedPhoto] = useState<ImagePickerAsset>();
  const [isCropping, setIsCropping] = useState(false);

  const { handleError } = useErrorsHandler();

  const takePhoto = useCallback(async () => {
    const permissions = await requestCameraPermissionsAsync();

    if (!permissions.granted) {
      // TODO: show notification, try again
      return;
    }

    const result = await launchCameraAsync(mediaOptions);

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0]);

      try {
        setIsCropping(true);
        const croppedPhoto = await cropToFace(result.assets[0]);

        setCroppedPhoto(croppedPhoto);
        onSelect(croppedPhoto);
        setIsCropping(false);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  const selectPhoto = useCallback(async () => {
    const permissions = await requestMediaLibraryPermissionsAsync();

    if (!permissions.granted) {
      // TODO: show notification, try again
      return;
    }

    const result = await launchImageLibraryAsync(mediaOptions);

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0]);

      try {
        setIsCropping(true);
        const croppedPhoto = await cropToFace(result.assets[0]);

        setCroppedPhoto(croppedPhoto);
        onSelect(croppedPhoto);
        setIsCropping(false);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  return (
    <>
      {enableCamera ? (
        <Button title="take a photo" onPress={takePhoto} />
      ) : null}
      <Button title="select a photo" onPress={selectPhoto} />

      <Image
        source={{
          uri: isCropping || !croppedPhoto ? photo?.uri : croppedPhoto.uri,
        }}
        className="h-40 w-40"
      />
    </>
  );
}

const cropToFace = async (photo: ImagePickerAsset) => {
  const detectedFaces = await detectFacesAsync(photo.uri, {
    mode: FaceDetectorMode.accurate,
  });

  if (!detectedFaces.faces[0]) throw new Error("no face detected");
  if (detectedFaces.faces.length > 1) throw new Error("too many faces");

  if (detectedFaces.faces[0].bounds.size.height < 1000)
    throw new Error("face too small");

  const OFFSET = detectedFaces.faces[0].bounds.size.width / 3;

  if (
    detectedFaces.faces[0].bounds.origin.x < OFFSET ||
    detectedFaces.faces[0].bounds.origin.y < OFFSET
  )
    throw new Error("face too close");

  const croppedPhoto = await manipulateAsync(
    photo.uri,
    [
      {
        crop: {
          originX: detectedFaces.faces[0].bounds.origin.x - OFFSET,
          height: detectedFaces.faces[0].bounds.size.height + OFFSET * 2,
          originY: detectedFaces.faces[0].bounds.origin.y - OFFSET,
          width: detectedFaces.faces[0].bounds.size.width + OFFSET * 2,
        },
      },
      {
        resize: {
          height: 1024,
          width: 1024,
        },
      },
    ],
    {
      compress: 1,
      format: SaveFormat.PNG,
      base64: true,
    },
  );

  return croppedPhoto;
};
