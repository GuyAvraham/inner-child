'use client';

import type { RefObject } from 'react';
import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { blobToUri, uriToBlob } from '~/utils/blob';
import { init } from '~/utils/d-id';
import AnimatedProgress from '~/components/AnimatedProgress';
import { api } from '~/trpc/react';
import { Age } from '~/types';

interface VideoStreamProps {
  videoRef?: RefObject<HTMLVideoElement | null>;
}

const VideoStream = ({ videoRef }: VideoStreamProps) => {
  const [old, setOld] = useState<string>('');
  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });

  useEffect(() => {
    if (!oldPhoto?.uri) return;
    void uriToBlob(oldPhoto.uri, true).then(blobToUri).then(setOld);
  }, [oldPhoto?.uri]);

  useEffect(() => {
    if (!videoRef?.current) return;

    if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'development') {
      void init(Age.Old, videoRef.current);
    }
  }, [videoRef]);

  return (
    <div className="relative flex-row justify-center">
      <div className="relative rounded-full border border-[#4285F4] bg-[#4285F4]/20 p-4">
        <div className="relative z-10 h-24 w-24 overflow-hidden rounded-full sm:h-40 sm:w-40">
          <div className={clsx('h-24 w-24 items-center justify-center sm:h-40 sm:w-40', !isOldLoading && 'hidden')}>
            <AnimatedProgress />
          </div>
          {old && (
            <Image
              height={200}
              width={200}
              src={old}
              alt="Future You"
              className={clsx('absolute h-24 w-24 rounded-full object-cover sm:h-40 sm:w-40', isOldLoading && 'hidden')}
            />
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            id="video-stream"
            key="video-stream"
            className={clsx('absolute h-24 w-24 rounded-full sm:h-40 sm:w-40', isOldLoading && 'opacity-0')}
            poster={old}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(VideoStream);
