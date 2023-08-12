import { useCallback } from "react";
import { Button, View } from "react-native";
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
  exif: true,
  allowsEditing: true,
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
        onSelect(result.assets[0]);
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
        onSelect(result.assets[0]);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  return (
    <View>
      {enableCamera ? (
        <Button
          title="take a photo"
          onPress={takePhoto}
        />
      ) : null}
      <Button
        title="select a photo"
        onPress={selectPhoto}
      />
    </View>
  );
}
