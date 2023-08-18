import { useCallback } from 'react';
import type { ImagePickerAsset } from 'expo-image-picker';
import {
  launchCameraAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
} from 'expo-image-picker';

import useErrorHandler from '~/hooks/useErrorHandler';
import Button from '../Button';

export default function TakePhotoButton({
  onTake,
}: {
  onTake: (photo: ImagePickerAsset) => void;
}) {
  const { handleError } = useErrorHandler();

  const selectPhoto = useCallback(async () => {
    const permissions = await requestCameraPermissionsAsync();

    // TODO: show notification, try again
    if (!permissions.granted) return;

    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        onTake(result.assets[0]);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onTake]);

  return (
    <Button
      onPress={selectPhoto}
      className="w-full">
      <Button.Text className="text-center text-lg">Take a Photo</Button.Text>
    </Button>
  );
}
