import { useCallback } from 'react';
import { Alert, Linking, View } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';

import useErrorHandler from '~/hooks/useErrorHandler';
import { SelectPhotoSVG } from '~/svg/selectPhoto';
import Button from '../ui/Button';

interface SelectPhotoButtonProps {
  onSelect: (photo: ImagePickerAsset) => void;
  title?: string;
}

export default function SelectPhotoButton({ onSelect, title }: SelectPhotoButtonProps) {
  const { handleError } = useErrorHandler();

  const selectPhoto = useCallback(async () => {
    const permissions = await requestMediaLibraryPermissionsAsync();

    if (!permissions.granted) {
      const alertTitle = 'Permissions denied';
      const alertMessage =
        'You asked to open gallery, but you refused to provide the permission in the past. To solve it please open the the device settings app and look for the permissions';

      Alert.alert(alertTitle, alertMessage, [
        { text: 'Open device settings', onPress: () => void Linking.openSettings() },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

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
    <Button onPress={selectPhoto} wide>
      <Button.Text>{title ?? 'Select a photo'}</Button.Text>
      <View className="w-2"></View>
      <SelectPhotoSVG />
    </Button>
  );
}
