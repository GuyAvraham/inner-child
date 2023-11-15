import { useCallback } from 'react';
import { Alert, Linking, View } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { launchCameraAsync, MediaTypeOptions, requestCameraPermissionsAsync } from 'expo-image-picker';

import useErrorHandler from '~/hooks/useErrorHandler';
import { TakePhotoSVG } from '~/svg/takePhoto';
import Button from '../ui/Button';

interface TakePhotoButtonProps {
  onTake: (photo: ImagePickerAsset) => void;
  title?: string;
}

export default function TakePhotoButton({ onTake, title }: TakePhotoButtonProps) {
  const { handleError } = useErrorHandler();

  const selectPhoto = useCallback(async () => {
    const permissions = await requestCameraPermissionsAsync();

    if (!permissions.granted) {
      const alertTitle = 'Permissions denied';
      const alertMessage =
        'You asked to make a photo, but you refused to provide the permission in the past. To solve it please open the the device settings app and look for the permissions';

      Alert.alert(alertTitle, alertMessage, [
        { text: 'Open device settings', onPress: () => void Linking.openSettings() },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

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
    <Button onPress={selectPhoto} wide>
      <Button.Text>{title ?? 'Take a photo'}</Button.Text>
      <View className="w-2"></View>
      <TakePhotoSVG />
    </Button>
  );
}
