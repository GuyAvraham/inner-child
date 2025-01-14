'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { generateToken } from '~/utils/token';
import Button from '~/components/Button';
import JumpingDots from '~/components/JumpingDots';
import { oldPhotoAtom, useCurrentPhotoAtom } from '~/atoms';
import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import { useRouteState } from '~/hooks/useRouteState';
import useUserData from '~/hooks/useUserData';
import NextSVG from '~/svg/NextSVG';
import ReplacePhotoSVG from '~/svg/ReplacePhotoSVG';
import { Age, Onboarded } from '~/types';
import PhotoSelect from './PhotoSelect';

export default function GenerationForm() {
  useOnboardedScreen(Onboarded.GenerateOld);
  const [currentPhoto] = useCurrentPhotoAtom();
  const [isReplacing, setIsReplacing] = useState(false);
  const utils = api.useContext();
  const { openChat, openUpload } = useRouteState();
  const {
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto(Age.Old, oldPhotoAtom);

  const { updateUserData } = useUserData();
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({ age: 'current' }, { refetchOnWindowFocus: false });
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  const generatedPhotos = useGenerateAgedPhotos(Age.Old);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });

    openUpload();
  }, [deleteAllPhotos, utils.photo, updateUserData, openUpload]);

  const submitPhoto = useCallback(async () => {
    if (!canSubmitOldPhoto) return;

    localStorage.setItem('wasPlayed', '');

    await uploadOldPhoto();
    await updateUserData({ onboarded: Onboarded.Finished });

    openChat();
  }, [canSubmitOldPhoto, openChat, updateUserData, uploadOldPhoto]);

  const generationFinished = useMemo(
    () => generatedPhotos.every((photo) => typeof photo === 'string'),
    [generatedPhotos],
  );

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative flex h-[256] w-[256] items-center justify-center rounded-full border border-white/40 bg-white/20 p-4">
        <Image
          className="h-28 w-28 self-center rounded-full object-cover"
          width={256}
          height={256}
          src={currentPhoto ?? currentPhotoDB?.uri ?? ''}
          alt={''}
        />
        <button
          className="absolute -bottom-4 -right-4 rounded-full bg-white/20 p-[6px]"
          onClick={replacePhotos}
          disabled={isReplacing || isOldPhotoUploading}
        >
          <div
            className={clsx(
              'absolute left-0 top-0 h-full w-full animate-spin rounded-full border-2 border-transparent border-t-white',
              !isReplacing && 'hidden',
            )}
          />
          <ReplacePhotoSVG />
        </button>
      </div>
      <p className="text-center">
        {generationFinished ? '   ' : 'Generating your future images'}
        {!generationFinished && <JumpingDots />}
      </p>

      <div className="w-full">
        <p className="mb-4 w-full sm:text-center">AI generated future photos: </p>
        <PhotoSelect photos={generatedPhotos} onPhotoSelect={handleOldPhoto} />
        {/* <PhotoSelect photos={[testImg, null, null, null]} onPhotoSelect={handleOldPhoto} /> */}
        {/* {all?.map((item, index) => <Image key={index} src={item.uri} width={100} height={100} alt="" />)} */}
      </div>

      <Button
        onClick={submitPhoto}
        wide
        blue
        disabled={!canSubmitOldPhoto || isOldPhotoUploading || isReplacing}
        className="w-full gap-2 sm:w-fit"
      >
        {isOldPhotoUploading ? 'Saving...' : 'Continue'}
        <NextSVG />
      </Button>
    </div>
  );
}
