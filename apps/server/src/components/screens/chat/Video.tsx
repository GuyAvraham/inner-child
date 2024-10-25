'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { blobToUri, uriToBlob } from '~/utils/blob';
import { uploadToS3 } from '~/utils/uploadToS3';
import AnimatedProgress from '~/components/AnimatedProgress';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import PlayPauseSVG from '~/svg/PlayPauseSVG';
import { Age } from '~/types';

interface ConversationAgeSelectProps {
  age: Age;
  setAge: (age: Age) => void;
  disabled?: boolean;
}

export default function Video({ age, setAge }: ConversationAgeSelectProps) {
  const utils = api.useContext();
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
        await uploadToS3(url, videoBlob);
        await utils.video.getByAge.invalidate();
        setVideoBlob(null);
      })();
    }
  }, [videoBlob]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!youngPhoto?.uri) return;
    void uriToBlob(youngPhoto.uri).then(blobToUri).then(setYoung);
  }, [youngPhoto?.uri]);

  useEffect(() => {
    if (!oldPhoto?.uri) return;
    void uriToBlob(oldPhoto.uri).then(blobToUri).then(setOld);
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

  // const handleChangeAge = useCallback(() => {
  //   setAge(age === Age.Young ? Age.Old : Age.Young);
  //   if (video) {
  //     setIsPlayVideo(false);
  //     void clearVideo();
  //   }
  // }, [age, setAge, clearVideo, video]);

  const handlePlayPauseVideo = useCallback(() => {
    setIsPlayVideo(!isPlayVideo);
    if (isPlayVideo) void clearVideo();
  }, [isPlayVideo, clearVideo]);

  const videoUri = useMemo(() => {
    if (video) return video;
    return age === Age.Young ? youngVideo?.uri : oldVideo?.uri;
  }, [video, age, youngVideo?.uri, oldVideo?.uri]);

  useEffect(() => {
    if (videoUri && videoUri.includes('d-id-talks')) {
      setIsPlayVideo(true);
    }
  }, [videoUri]);

  const imageUri = age === Age.Young ? young : old;
  const secondaryImageUri = age === Age.Young ? old : young;
  const isLoading = age === Age.Young ? isYoungLoading || !young : isOldLoading || !old;

  return (
    <div className="relative flex-row justify-center ">
      <div className="relative rounded-full border border-[#4285F4] bg-[#4285F4]/20 p-2">
        {/* <Animation isLoading={isVideoLoading} /> */}
        {videoUri && (
          <button
            className="absolute bottom-0 right-0 z-10 rounded-full border-0 bg-[#4285F4]/80 p-2 outline-none"
            onClick={handlePlayPauseVideo}
          >
            <PlayPauseSVG pause={isPlayVideo} />
          </button>
        )}
        {isLoading ? (
          <div className="h-40 w-40 items-center justify-center">
            <AnimatedProgress />
          </div>
        ) : videoUri && isPlayVideo ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            key={videoUri ?? 'no-video'}
            className="m-2 h-40 w-40 rounded-full"
            src={videoUri}
            poster={imageUri}
            autoPlay
            // onPlaybackStatusUpdate={handleVideoStatusUpdate}
          />
        ) : (
          <Image height={200} width={200} src={imageUri} alt="" className="m-2 h-40 w-40 rounded-full" />
        )}
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
  // return <video ref={videoRef} autoPlay playsInline width={400} height={400} className="bg-orange-400"></video>;
}

// function Animation({ isLoading }: { isLoading: boolean }) {
//   const [angle, setAngle] = useState(0);

//   useEffect(() => {
//     if (!isLoading) return;

//     const interval = setInterval(() => {
//       setAngle((angle) => angle + 2);
//     }, 33);

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   return (
//     <div
//       className="absolute left-2 top-2 h-full w-full rounded-full border-2 border-transparent border-t-[#4285F4]"
//       style={{
//         transform: [{ rotate: `${angle}deg` }],
//         borderTopColor: !isLoading ? 'transparent' : '#4285F4',
//       }}
//     />
//   );
// }
