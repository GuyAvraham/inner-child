import { useCallback, useEffect } from 'react';

import { api } from '~/utils/api';
import { useVideoLoadingAtom, useVideoPredictionIdAtom, useVideoUriAtom } from '~/atoms';
import type { Age } from '~/types';
import useUserData from './useUserData';

export const useVideoResponse = (age: Age) => {
  const { data } = useUserData();
  const utils = api.useContext();
  const [videoPredictionId, setVideoPredictionId] = useVideoPredictionIdAtom();
  const [videoURI, setVideoURI] = useVideoUriAtom();
  const [isLoading, setIsLoading] = useVideoLoadingAtom();
  const { mutateAsync: getVideo, isLoading: isPredictionLoading } = api.conversation.video.useMutation({
    onError(error) {
      setIsLoading(false);
      alert(`Video Generation Error: ${error.message}`);
    },
  });
  const { data: videoURIData, isLoading: isVideoLoading } = api.conversation.waitForVideo.useQuery(
    { predictionId: videoPredictionId! },
    { enabled: !!videoPredictionId && !videoURI, refetchInterval: 2000 },
  );

  useEffect(() => {
    setVideoURI(videoURIData ?? null);
    if (videoURIData) setIsLoading(false);
  }, [videoURIData, setVideoURI, setIsLoading]);

  const triggerVideoGeneration = useCallback(
    async (text: string) => {
      setVideoPredictionId(null);
      setIsLoading(true);
      const gender = data.gender as 'male' | 'female';
      const predictionId = await getVideo({ age, text, gender }).catch(console.error);
      setVideoPredictionId(predictionId ?? null);
    },
    [age, getVideo, setVideoPredictionId, setIsLoading, data?.gender],
  );

  const clearVideo = useCallback(async () => {
    setVideoPredictionId(null);
    setVideoURI(null);
    setIsLoading(false);
    await utils.conversation.waitForVideo.invalidate();
  }, [utils.conversation.waitForVideo, setVideoPredictionId, setVideoURI, setIsLoading]);

  return {
    video: videoURI,
    isLoading:
      isLoading || isPredictionLoading || (!!videoPredictionId && isVideoLoading) || (!!videoPredictionId && !videoURI),
    triggerVideoGeneration,
    clearVideo,
  };
};
