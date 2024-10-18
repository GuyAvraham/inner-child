'use client';

import Image from 'next/image';

import { api } from '~/utils/api';
import { oldPhotoAtom, useCurrentPhotoAtom } from '~/atoms';
import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import { Age } from '~/types';
import PhotoSelect from './PhotoSelect';

export default function GenerationForm() {
  const [currentPhoto] = useCurrentPhotoAtom();
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({ age: 'current' });
  const generatedPhotos = useGenerateAgedPhotos(Age.Old);
  const {
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto(Age.Old, oldPhotoAtom);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-[256] w-[256] overflow-hidden rounded-full bg-green-300">
        <Image
          className="h-28 w-28 self-center object-cover"
          width={256}
          height={256}
          src={currentPhoto ?? currentPhotoDB?.uri ?? ''}
          alt={''}
        />
      </div>
      <p className="mb-14 mt-10 text-center">Generating your future images...</p>

      <div className="w-full">
        <p className="w-full text-center">AI generated future photos: </p>
        {generatedPhotos.map((item, index) => (
          <p key={index} className="w-full text-center">
            {String(item)}
          </p>
        ))}
        <PhotoSelect photos={generatedPhotos} onPhotoSelect={handleOldPhoto} />
      </div>
    </div>
  );
}
