'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { api } from '~/utils/api';
import { generateToken } from '~/utils/token';
import Button from '~/components/Button';
import JumpingDots from '~/components/JumpingDots';
import { oldPhotoAtom, useCurrentPhotoAtom } from '~/atoms';
import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import useUserData from '~/hooks/useUserData';
import NextSVG from '~/svg/NextSVG';
import ReplacePhotoSVG from '~/svg/ReplacePhotoSVG';
import { Age, Onboarded } from '~/types';
import PhotoSelect from './PhotoSelect';

const testImg =
  'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yblFpMExhdGhBWWFaU2hiYzlhYkg1Nm03eGQifQ?width=80 1x,https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yblFpMExhdGhBWWFaU2hiYzlhYkg1Nm03eGQifQ?width=160';

export default function GenerationForm() {
  useOnboardedScreen(Onboarded.GenerateOld);
  const [currentPhoto] = useCurrentPhotoAtom();
  const [isReplacing, setIsReplacing] = useState(false);
  const utils = api.useContext();
  const router = useRouter();
  const {
    canSubmit: canSubmitOldPhoto,
    handlePhoto: handleOldPhoto,
    isUploading: isOldPhotoUploading,
    upload: uploadOldPhoto,
  } = useHandlePhoto(Age.Old, oldPhotoAtom);

  const { updateUserData } = useUserData();
  const { data: currentPhotoDB } = api.photo.getByAge.useQuery({ age: 'current' });
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();
  // const generatedPhotos = useGenerateAgedPhotos(Age.Old);
  const { data: all } = api.photo.getAll.useQuery();

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.replace('/onboarding');
  }, [router, updateUserData, utils.photo, deleteAllPhotos]);

  // useEffect(() => {
  //   if (currentPhotoDB === null) {
  //     router.replace('/');
  //   }
  // }, [currentPhotoDB, router]);

  const submitPhoto = useCallback(async () => {
    if (!canSubmitOldPhoto) return;

    await uploadOldPhoto();
    await updateUserData({ onboarded: Onboarded.Finished });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.push('/chat');
  }, [canSubmitOldPhoto, router, updateUserData, uploadOldPhoto]);

  // const generationFinished = useMemo(
  //   () => generatedPhotos.every((photo) => typeof photo === 'string'),
  //   [generatedPhotos],
  // );

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative flex h-[256] w-[256] items-center justify-center rounded-full border border-white/40 bg-white/20 p-4">
        <Image
          className="h-28 w-28 self-center rounded-full object-cover"
          width={256}
          height={256}
          src={currentPhoto ?? currentPhotoDB?.uri ?? testImg ?? ''}
          alt={''}
        />
        <button
          className="absolute -bottom-4 -right-4 rounded-full bg-white/20 p-[6px]"
          onClick={replacePhotos}
          disabled={isReplacing || isOldPhotoUploading}
        >
          <ReplacePhotoSVG />
        </button>
      </div>
      <p className="text-center">
        Generating your future images
        <JumpingDots />
      </p>

      <div className="w-full">
        <p className="mb-4 w-full sm:text-center">AI generated future photos: </p>
        {/* <PhotoSelect photos={generatedPhotos} onPhotoSelect={handleOldPhoto} /> */}
        <PhotoSelect photos={[testImg, null, null, null]} onPhotoSelect={handleOldPhoto} />
        {/* {all?.map((item, index) => <Image key={index} src={item.uri} width={100} height={100} alt="" />)} */}
      </div>

      <Button
        onClick={submitPhoto}
        wide
        blue
        disabled={!canSubmitOldPhoto || isOldPhotoUploading}
        className="w-full gap-2 sm:w-fit"
      >
        {isOldPhotoUploading ? 'Saving...' : 'Continue'}
        <NextSVG />
      </Button>
    </div>
  );
}
