import { useCallback, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import clsx from 'clsx';

import useErrorHandler from '~/hooks/useErrorHandler';
import { CloseSVG } from '~/svg/close';
import { SelectedSVG } from '~/svg/selected';
import { UploadPhotoSVG } from '~/svg/uploadPhoto';
import Text from '../ui/Text';
import { SelectedPhoto } from './SelectedPhoto';

interface ChoosePhotoProps {
  onSelect: (photo: string | null) => void;
  photo?: string | null;
}

export function ChoosePhoto({ photo, onSelect }: ChoosePhotoProps) {
  const { handleError } = useErrorHandler();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleClearPress = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      setSelectedPhoto(null);
      onSelect(null);
    },
    [onSelect],
  );

  const handlePress = useCallback(async () => {
    if (selectedPhoto) {
      onSelect(selectedPhoto);
      return;
    }

    const permissions = await requestMediaLibraryPermissionsAsync();

    // TODO: show notification, try again
    if (!permissions.granted) return;

    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      try {
        onSelect(result.assets[0].uri);
        setSelectedPhoto(result.assets[0].uri);
      } catch (error) {
        handleError(error);
      }
    }
  }, [handleError, onSelect, selectedPhoto]);

  return (
    <View style={{ aspectRatio: '1 / 1' }} className="relative w-1/3 p-3">
      {selectedPhoto && (
        <TouchableOpacity onPress={handleClearPress} className="absolute right-1 top-1 z-10">
          <CloseSVG />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        disabled={selectedPhoto === photo && !!selectedPhoto}
        onPress={handlePress}
        className={clsx(
          'h-full w-full items-center justify-center rounded-full border border-white/40 p-3',
          (selectedPhoto !== photo || !photo) && 'bg-white/20',
          selectedPhoto === photo && !!photo && 'border-white bg-[#1877F2]/30',
        )}
      >
        {selectedPhoto ? (
          <SelectedPhoto source={selectedPhoto} className="h-full w-full rounded-full" />
        ) : (
          <View className="relative -top-0.5 items-center" style={{ transform: [{ scale: 0.8 }] }}>
            <UploadPhotoSVG />
            <Text className="mt-1 text-center">Choose your own</Text>
          </View>
        )}
      </TouchableOpacity>
      {selectedPhoto === photo && !!selectedPhoto && (
        <View className="absolute bottom-2.5 right-2.5">
          <SelectedSVG />
        </View>
      )}
    </View>
  );
}
