'use client';

import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { blobToUri, uriToBlob } from '~/utils/blob';
import AnimatedProgress from '~/components/AnimatedProgress';
import { Age } from '~/types';

interface VideoStreamProps {
  videoRef?: MutableRefObject<HTMLVideoElement | null>;
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

  return (
    <div className="relative flex-row justify-center">
      <div className="relative rounded-full border border-[#4285F4] bg-[#4285F4]/20 p-4">
        <div className="relative z-10 h-40 w-40 overflow-hidden rounded-full">
          <div className={clsx('h-40 w-40 items-center justify-center', !isOldLoading && 'hidden')}>
            <AnimatedProgress />
          </div>
          {old && (
            <Image
              height={200}
              width={200}
              src={old}
              alt="Future You"
              className={clsx('absolute h-40 w-40 rounded-full object-cover', isOldLoading && 'hidden')}
            />
          )}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            autoPlay
            id="video-stream"
            key="video-stream"
            className={clsx('absolute h-40 w-40 rounded-full', isOldLoading && 'opacity-0')}
            poster={old}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
