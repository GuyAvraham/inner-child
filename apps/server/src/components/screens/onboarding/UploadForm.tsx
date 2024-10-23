'use client';

import type { MouseEvent } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '~/components/Button';
import { currentPhotoAtom } from '~/atoms';
import useHandlePhoto from '~/hooks/useHandlePhoto';
import useOnboardedScreen from '~/hooks/useOnboardedScreen';
import SelectPhotoSVG from '~/svg/SelectPhotoSVG';
import TakePhotoSVG from '~/svg/TakePhotoSVG';
import { Onboarded } from '~/types';

export default function UploadForm() {
  useOnboardedScreen(Onboarded.Current);
  const { photo, handlePhoto, upload, isUploading, canSubmit } = useHandlePhoto('current', currentPhotoAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function selectFile() {
    const file = fileInputRef?.current?.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          await handlePhoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadFile(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    await upload();
    router.replace('/generateOld');
  }

  return (
    <form className="flex flex-1 flex-col items-center sm:mx-auto sm:w-[430px] sm:flex-initial">
      <input type="file" name="file" ref={fileInputRef} onChange={selectFile} className="h-0 w-0 opacity-0" />
      {photo && (
        <div className="h-[400px] rounded-xl border border-white/20 bg-white/10 p-4">
          <Image src={photo} width={400} height={400} alt={photo} className="h-full w-full rounded-lg object-cover" />
        </div>
      )}
      <div className="mt-auto flex w-full flex-col items-center gap-4 sm:mt-8">
        <Button type="button" onClick={() => fileInputRef.current?.click()} blue wide className="w-full gap-2">
          {photo ? 'Select another photo' : 'Select photo'}
          <SelectPhotoSVG />
        </Button>
        <Button
          type="submit"
          onClick={uploadFile}
          blue
          disabled={!canSubmit || isUploading}
          wide
          className="w-full gap-2"
        >
          {isUploading ? 'Uploading...' : 'Ok, Upload this photo'}
          <TakePhotoSVG />
        </Button>
      </div>
    </form>
  );
}
