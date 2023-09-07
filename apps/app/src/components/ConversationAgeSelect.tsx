import { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AVPlaybackStatus } from 'expo-av';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';

import { api } from '~/utils/api';
import { blobToUri, uriToBlob } from '~/utils/blob';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import { ChangeAgeVG } from '~/svg/changeAge';
import { Age } from '~/types';
import { AnimatedProgress } from './AnimatedProgress';

interface ConversationAgeSelectProps {
  age: Age;
  setAge: (age: Age) => void;
}

export function ConversationAgeSelect({ age, setAge }: ConversationAgeSelectProps) {
  const { data: youngPhoto, isLoading: isYoungLoading } = api.photo.getByAge.useQuery({
    age: Age.Young,
  });
  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });
  const { video, clearVideo } = useVideoResponse(age);
  const [young, setYoung] = useState<string>('');
  const [old, setOld] = useState<string>('');

  useEffect(() => {
    if (!youngPhoto?.uri) return;
    void uriToBlob(youngPhoto.uri).then(blobToUri).then(setYoung);
  }, [youngPhoto?.uri]);

  useEffect(() => {
    if (!oldPhoto?.uri) return;
    void uriToBlob(oldPhoto.uri).then(blobToUri).then(setOld);
  }, [oldPhoto?.uri]);

  const handleVideoStatusUpdate = useCallback(
    async (status: AVPlaybackStatus) => {
      if (status.isLoaded && status.positionMillis === status.durationMillis) await clearVideo();
    },
    [clearVideo],
  );

  const handleChangeAge = useCallback(() => {
    setAge(age === Age.Young ? Age.Old : Age.Young);
  }, [age, setAge]);

  const imageUri = age === Age.Young ? young : old;
  const secondaryImageUri = age === Age.Young ? old : young;
  const isLoading = age === Age.Young ? isYoungLoading || !young : isOldLoading || !old;

  return (
    <View className="relative flex-row justify-center">
      <View className="rounded-full border border-[#4285F4] bg-[#4285F4]/20 p-2">
        {isLoading ? (
          <View className="h-40 w-40 items-center justify-center">
            <AnimatedProgress fast />
          </View>
        ) : video ? (
          <Video
            className="m-2 h-40 w-40 rounded-full"
            source={{ uri: video }}
            shouldPlay={true}
            isMuted={false}
            volume={1}
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={handleVideoStatusUpdate}
          />
        ) : (
          <Image source={{ uri: imageUri }} alt="" className="m-2 h-40 w-40 rounded-full" />
        )}
      </View>

      <View className="absolute right-3 flex-row items-center">
        <TouchableOpacity onPress={handleChangeAge}>
          <ChangeAgeVG />
        </TouchableOpacity>
        <Image source={{ uri: secondaryImageUri }} alt="" className="h-10 w-10 rounded-full" />
      </View>
    </View>
  );
}
