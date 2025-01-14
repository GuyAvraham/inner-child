'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { blobToUri, uriToBlob } from '~/utils/blob';
import AnimatedProgress from '~/components/AnimatedProgress';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import PlayPauseSVG from '~/svg/PlayPauseSVG';
import { Age } from '~/types';
import VideoLoadingAnimation from './VideoLoadingAnimation';

interface ConversationAgeSelectProps {
  age: Age;
  setAge: (age: Age) => void;
  disabled?: boolean;
}

export default function Video({ age }: ConversationAgeSelectProps) {
  const utils = api.useContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: youngPhoto, isLoading: isYoungLoading } = api.photo.getByAge.useQuery({
    age: Age.Young,
  });
  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });
  const { data: youngVideo } = api.video.getByAge.useQuery({ age: Age.Young });
  const { data: oldVideo } = api.video.getByAge.useQuery({ age: Age.Old });
  const { mutateAsync: getUploadURL } = api.upload.getURL.useMutation();
  const { mutateAsync: saveVideo } = api.video.create.useMutation();
  const { mutateAsync: deleteVideo } = api.video.deleteByAge.useMutation();
  const { video, clearVideo, isLoading: isVideoLoading } = useVideoResponse(age);
  const [young, setYoung] = useState<string>('');
  const [old, setOld] = useState<string>('');

  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isPlayVideo, setIsPlayVideo] = useState<boolean>(false);
  // const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (video) {
      void uriToBlob(video).then(setVideoBlob);
    } else {
      setVideoBlob(null);
    }
  }, [video]);

  useEffect(() => {
    if (videoBlob) {
      void (async () => {
        await deleteVideo({ age });
        const key = `${age}-${Date.now()}.${videoBlob?.type.split('/').at(1) ?? 'mp4'}`;
        const url = await getUploadURL({ key });
        await saveVideo({ age, key });
        // await uploadToS3(url, videoBlob);
        const formData = new FormData();
        formData.append('url', url);
        formData.append('file', videoBlob);
        const response = (await fetch('/api/uploadImage', {
          method: 'POST',
          body: formData,
        }).then((resp) => resp.json())) as { status: 'success' | 'fail'; error?: unknown };

        if (response.status === 'success') {
          await utils.video.getByAge.invalidate();
        }
        setVideoBlob(null);
      })();
    }
  }, [videoBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!youngPhoto?.uri) return;
    void uriToBlob(youngPhoto.uri, true).then(blobToUri).then(setYoung);
  }, [youngPhoto?.uri]);

  useEffect(() => {
    if (!oldPhoto?.uri) return;
    void uriToBlob(oldPhoto.uri, true).then(blobToUri).then(setOld);
  }, [oldPhoto?.uri]);

  // const handleVideoStatusUpdate = useCallback(
  //   (status: AVPlaybackStatus) => {
  //     if (status.isLoaded && (status.durationMillis ?? 0) - status.positionMillis < 1000) {
  //       setIsPlayVideo(false);
  //       void clearVideo();
  //     }
  //   },
  //   [clearVideo],
  // );

  const handleVideoEnded = useCallback(() => {
    setIsPlayVideo(false);
    void clearVideo();
  }, [clearVideo]);

  // const handleChangeAge = useCallback(() => {
  //   setAge(age === Age.Young ? Age.Old : Age.Young);
  //   if (video) {
  //     setIsPlayVideo(false);
  //     void clearVideo();
  //   }
  // }, [age, setAge, clearVideo, video]);

  const handlePlayPauseVideo = useCallback(() => {
    setIsPlayVideo((prev) => !prev);
    if (isPlayVideo) void clearVideo();
  }, [isPlayVideo, clearVideo]);

  const videoUri = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SERVER_MODE === 'development') {
      return '/old-video.mp4';
    }

    if (video) return video;
    return age === Age.Young ? youngVideo?.uri : oldVideo?.uri;
  }, [video, age, youngVideo?.uri, oldVideo?.uri]);

  useEffect(() => {
    // if (videoUri && videoUri.includes('d-id-talks')) {
    if (videoUri && !localStorage.getItem('wasPlayed')) {
      setIsPlayVideo(true);
      localStorage.setItem('wasPlayed', 'true');
    }
  }, [videoUri]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlayVideo) {
        void videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlayVideo]);

  const imageUri = age === Age.Young ? young : old;
  // const secondaryImageUri = age === Age.Young ? old : young;
  const isLoading = age === Age.Young ? isYoungLoading || !young : isOldLoading || !old;

  return (
    <div className="relative flex-row justify-center ">
      <div className="relative rounded-full border border-[#4285F4] bg-[#4285F4]/20 p-4">
        <VideoLoadingAnimation isLoading={isVideoLoading} />
        <button
          className={clsx(
            'absolute bottom-0 right-0 z-20 rounded-full border-0 bg-[#4285F4]/80 p-2 outline-none',
            !videoUri && 'hidden',
          )}
          onClick={handlePlayPauseVideo}
        >
          <PlayPauseSVG pause={isPlayVideo} />
        </button>
        <div className="relative z-10 h-40 w-40 overflow-hidden rounded-full">
          <div className={clsx('h-40 w-40 items-center justify-center', !isLoading && 'hidden')}>
            <AnimatedProgress />
          </div>
          {imageUri && (
            <Image
              height={200}
              width={200}
              src={imageUri}
              alt=""
              className={clsx('absolute h-40 w-40 rounded-full object-cover', isLoading && 'hidden')}
            />
          )}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            key={videoUri ?? 'no-video'}
            className={clsx('absolute h-40 w-40 rounded-full', (!videoUri || !isPlayVideo) && 'opacity-0')}
            src={videoUri}
            poster={imageUri}
            onEnded={handleVideoEnded}
            // onPlaybackStatusUpdate={handleVideoStatusUpdate}
          />
        </div>
      </div>

      {/* <div className="absolute right-3 flex-row items-center">
        {!disabled && (
          <TouchableOpacity onPress={handleChangeAge}>
            <ChangeAgeVG />
          </TouchableOpacity>
        )}
        <Image source={{ uri: secondaryImageUri }} alt="" className="h-10 w-10 rounded-full" />
      </div> */}
    </div>
  );
}
