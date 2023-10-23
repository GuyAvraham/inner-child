import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

import { SelectedSVG } from '~/svg/selected';
import { AnimatedProgress } from '../AnimatedProgress';
import { ChoosePhoto } from './ChoosePhoto';
import SelectedPhoto from './SelectedPhoto';

interface PhotoSelectProps {
  photos: (string | null)[];
  onPhotoSelect: (photo: string) => void;
  chooseFromGallery?: boolean;
  presetCount?: number;
}

const duration: Record<number, number> = {
  0: 60,
  1: 90,
  2: 45,
  3: 70,
};

// index - seconds to generate
//  LOG  0 4.053 // from guess the name
//  LOG  1 4.056 // from guess the name
//  LOG  2 349.337
//  LOG  3 199.45
//  LOG  4 96.899
//  LOG  5 160.678

export function PhotoSelect({ photos, onPhotoSelect, chooseFromGallery, presetCount = 0 }: PhotoSelectProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoPress = useCallback(
    (photo: string | null) => {
      if (photo) {
        onPhotoSelect(photo);
        setSelectedPhoto(photo);
      }
    },
    [onPhotoSelect],
  );

  return (
    <View className="w-full flex-row flex-wrap">
      {photos.map((photo, index) => (
        <TouchableOpacity
          key={`${photo}_${index}`}
          className="relative w-1/3 p-3"
          style={{ aspectRatio: '1 / 1' }}
          onPress={() => handlePhotoPress(photo)}
          disabled={selectedPhoto === photo || !photo}
        >
          <View
            className={clsx(
              'h-full w-full items-center justify-center rounded-full border border-white/40 p-3',
              (selectedPhoto !== photo || !photo) && 'bg-white/20',
              selectedPhoto === photo && !!photo && 'border-white bg-[#1877F2]/30',
            )}
          >
            {photo ? (
              <SelectedPhoto source={photo} className="h-full w-full rounded-full" />
            ) : (
              <View className="relative -top-1" style={{ transform: [{ scale: 0.8 }] }}>
                <AnimatedProgress duration={duration[index - presetCount] ?? undefined} />
              </View>
            )}
          </View>
          {selectedPhoto === photo && !!photo && (
            <View className="absolute bottom-2.5 right-2.5">
              <SelectedSVG />
            </View>
          )}
        </TouchableOpacity>
      ))}
      {chooseFromGallery && <ChoosePhoto onSelect={handlePhotoPress} photo={selectedPhoto} />}
    </View>
  );
}
