import { useCallback } from 'react';
import type { ImagePickerAsset } from 'expo-image-picker';
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';

import useErrorHandler from '~/hooks/useErrorHandler';
import Button from '../Button';

export default function SelectPhotoButton({
  onSelect,
}: {
  onSelect: (photo: ImagePickerAsset) => void;
}) {
  const { handleError } = useErrorHandler();

  const selectPhoto = useCallback(async () => {
    const permissions = await requestMediaLibraryPermissionsAsync();

    // TODO: show notification, try again
    if (!permissions.granted) return;

    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        onSelect(result.assets[0]);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect]);

  return (
    <Button
      onPress={selectPhoto}
      className="w-full">
      <Button.Text className="text-center text-lg">Select a Photo</Button.Text>
    </Button>
  );
}
