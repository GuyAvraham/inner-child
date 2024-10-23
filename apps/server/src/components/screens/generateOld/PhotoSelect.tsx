'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import AnimatedProgress from '~/components/AnimatedProgress';
import SelectedSVG from '~/svg/SelectedSVG';

interface PhotoSelectProps {
  photos: (string | null)[];
  onPhotoSelect: (photo: string) => void;
  chooseFromGallery?: boolean;
}

const loadingPredictionsIdTime = 20;

const duration: Record<number, number> = {
  0: 60 + loadingPredictionsIdTime,
  1: 90 + loadingPredictionsIdTime,
  2: 45 + loadingPredictionsIdTime,
  3: 70 + loadingPredictionsIdTime,
};

export default function PhotoSelect({ photos, onPhotoSelect, chooseFromGallery }: PhotoSelectProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handlePhotoPress = useCallback(
    (photo: string | null) => {
      if (selectedPhoto === photo || !photo) return;

      if (photo) {
        onPhotoSelect(photo);
        setSelectedPhoto(photo);
      }
    },
    [onPhotoSelect, selectedPhoto],
  );

  return (
    <div className="flex w-full flex-row flex-wrap justify-center">
      {photos.map((photo, index) => (
        <div
          key={`${photo}_${index}`}
          className="relative w-[256px] p-3"
          style={{ aspectRatio: '1 / 1' }}
          onClick={() => handlePhotoPress(photo)}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          title={String(photo)}
        >
          <div
            className={clsx(
              'flex h-full w-full items-center justify-center rounded-full border border-white/40 p-3',
              (selectedPhoto !== photo || !photo) && 'bg-white/20',
              selectedPhoto === photo && !!photo && 'border-white bg-[#1877F2]/30',
            )}
          >
            {photo ? (
              <Image className="h-28 w-28 self-center object-cover" width={256} height={256} src={photo} alt={''} />
            ) : (
              <div className="h-28 w-28">
                <AnimatedProgress duration={duration[index] ?? undefined} />
              </div>
            )}
          </div>
          {selectedPhoto === photo && !!photo && (
            <div className="absolute bottom-2.5 right-2.5">
              <SelectedSVG />
            </div>
          )}
        </div>
      ))}
      {/* {chooseFromGallery && <ChoosePhoto onSelect={handlePhotoPress} photo={selectedPhoto} />} */}
    </div>
  );
}
