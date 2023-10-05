import { useCallback, useEffect } from 'react';

import { api } from '~/utils/api';
import { useVideoPredictionIdAtom, useVideoUriAtom } from '~/atoms';
import type { Age } from '~/types';
import useUserData from './useUserData';

export const useVideoResponse = (age: Age) => {
  const { data } = useUserData();
  const utils = api.useContext();
  const [videoPredictionId, setVideoPredictionId] = useVideoPredictionIdAtom();
  const [videoURI, setVideoURI] = useVideoUriAtom();
  const { mutateAsync: getVideo, isLoading: isPredictionLoading } = api.conversation.video.useMutation();
  const { data: videoURIData, isLoading: isVideoLoading } = api.conversation.waitForVideo.useQuery(
    { predictionId: videoPredictionId! },
    { enabled: !!videoPredictionId && !videoURI, refetchInterval: 2000 },
  );

  useEffect(() => {
    setVideoURI(videoURIData ?? null);
  }, [videoURIData, setVideoURI]);

  const triggerVideoGeneration = useCallback(
    async (text: string) => {
      setVideoPredictionId(null);
      const gender = data.gender as 'male' | 'female';
      const predictionId = await getVideo({ age, text, gender });
      setVideoPredictionId(predictionId);
    },
    [age, getVideo, setVideoPredictionId, data?.gender],
  );

  const clearVideo = useCallback(async () => {
    setVideoPredictionId(null);
    setVideoURI(null);
    await utils.conversation.waitForVideo.invalidate();
  }, [utils.conversation.waitForVideo, setVideoPredictionId, setVideoURI]);

  return {
    video: videoURI,
    isLoading: isPredictionLoading || (!!videoPredictionId && isVideoLoading),
    triggerVideoGeneration,
    clearVideo,
  };
};
