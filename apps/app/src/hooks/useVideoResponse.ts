import { useCallback } from 'react';

import { api } from '~/utils/api';
import { useVideoPredictionIdAtom } from '~/atoms';
import type { Age } from '~/types';

export const useVideoResponse = (age: Age) => {
  const utils = api.useContext();
  const [videoPredictionId, setVideoPredictionId] = useVideoPredictionIdAtom();
  const { mutateAsync: getVideo, isLoading: isPredictionLoading } = api.conversation.video.useMutation();
  const { data: videoURI, isLoading: isVideoLoading } = api.conversation.waitForVideo.useQuery(
    { predictionId: videoPredictionId! },
    { enabled: !!videoPredictionId, refetchInterval: 2000 },
  );

  const triggerVideoGeneration = useCallback(
    async (text: string) => {
      setVideoPredictionId(null);
      const predictionId = await getVideo({ age, text });
      setVideoPredictionId(predictionId);
    },
    [age, getVideo, setVideoPredictionId],
  );

  const clearVideo = useCallback(async () => {
    setVideoPredictionId(null);
    await utils.conversation.waitForVideo.invalidate();
  }, [utils.conversation.waitForVideo, setVideoPredictionId]);

  return {
    video: videoURI,
    isLoading: isPredictionLoading || (!!videoPredictionId && isVideoLoading),
    triggerVideoGeneration,
    clearVideo,
  };
};
