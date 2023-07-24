import { useCallback } from "react";
import { Button, View } from "react-native";
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
  const { handleError } = useErrorsHandler();

  const takePhoto = useCallback(async () => {
    const permissions = await requestCameraPermissionsAsync();

    if (!permissions.granted) {
      // TODO: show notification, try again
      return;
    }

    const result = await launchCameraAsync(mediaOptions);

    if (!result.canceled && result.assets[0]) {
      try {
        const croppedPhoto = await cropToFace(result.assets[0]);

        onSelect(croppedPhoto);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  // TODO: maybe make it generic; a lot of code is repeated
  const selectPhoto = useCallback(async () => {
    const permissions = await requestMediaLibraryPermissionsAsync();

    if (!permissions.granted) {
      // TODO: show notification, try again
      return;
    }

    const result = await launchImageLibraryAsync(mediaOptions);

    if (!result.canceled && result.assets[0]) {
      try {
        const croppedPhoto = await cropToFace(result.assets[0]);

        onSelect(croppedPhoto);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  return (
    <View>
      {enableCamera ? (
        <Button title="take a photo" onPress={takePhoto} />
      ) : null}
      <Button title="select a photo" onPress={selectPhoto} />
    </View>
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
          height: 1000,
          width: 1000,
        },
      },
    ],
    {
      compress: 1,
      format: SaveFormat.JPEG,
      base64: true,
    },
  );

  return croppedPhoto;
};
