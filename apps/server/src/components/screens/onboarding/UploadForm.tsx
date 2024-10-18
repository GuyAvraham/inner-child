'use client';

import type { MouseEvent } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '~/components/Button';
import { currentPhotoAtom } from '~/atoms';
import useHandlePhoto from '~/hooks/useHandlePhoto';

export default function UploadForm() {
  const { photo, handlePhoto, upload, isUploading } = useHandlePhoto('current', currentPhotoAtom);
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
    <form className="flex flex-col items-center gap-4">
      {/* <div class="wrapper-file-input">
        <div class="input-box" @click="openFileInput">
          <h4>
            <i class="fa-solid fa-upload"></i>
            Choose File to upload
          </h4>
          <input
            ref="fileInput"
            type="file"
            hidden
            @change="handleFileChange"
            multiple
          />
        </div>
        <small>Files Supported: PDF, TEXT, DOC, DOCX, JPG, PNG, SVG</small>
      </div> */}

      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#cacaca] p-5">
        <span>{photo ? 'Upload another file' : 'Upload a file'}</span>
        <input type="file" name="file" ref={fileInputRef} onChange={selectFile} className="h-0 w-0 opacity-0" />
      </label>
      <div className="flex flex-col gap-4">
        {photo && (
          <div className="h-[300px] w-[300px] overflow-hidden rounded-full">
            <Image src={photo} width={400} height={400} alt={photo} className="max-h-full max-w-full object-cover" />
          </div>
        )}
      </div>
      {photo && (
        <Button type="submit" onClick={uploadFile} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      )}
    </form>
  );
}
