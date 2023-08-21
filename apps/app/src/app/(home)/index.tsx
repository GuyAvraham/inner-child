import { useCallback, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import type { AVPlaybackStatus } from 'expo-av';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';

import { api } from '~/utils/api';
import Button from '~/components/ui/Button';
import Text from '~/components/ui/Text';

const useVideoResponse = (age: 'young' | 'old') => {
  const [videoPredictionId, setVideoPredictionId] = useState<string | null>(
    null,
  );

  const utils = api.useContext();

  const { mutateAsync: getVideo, isLoading: isPredictionLoading } =
    api.conversation.video.useMutation();
  const { data: videoURI, isLoading: isVideoLoading } =
    api.conversation.waitForVideo.useQuery(
      { predictionId: videoPredictionId! },
      { enabled: !!videoPredictionId, refetchInterval: 2000 },
    );

  const triggerVideoGeneration = useCallback(
    async (text: string) => {
      setVideoPredictionId(null);

      const predictionId = await getVideo({
        age,
        text,
      });

      setVideoPredictionId(predictionId);
    },
    [age, getVideo],
  );

  const clearVideo = useCallback(async () => {
    setVideoPredictionId(null);
    await utils.conversation.waitForVideo.invalidate();
  }, [utils.conversation.waitForVideo]);

  return {
    video: videoURI,
    isLoading: isPredictionLoading || (!!videoPredictionId && isVideoLoading),
    triggerVideoGeneration,
    clearVideo,
  };
};

export default function HomeScreen() {
  const [conversationStatus, setConversationStatus] = useState<
    'idle' | 'waiting'
  >('idle');
  const [conversationAge, setConversationAge] = useState<'old' | 'young'>(
    'young',
  );
  const [message, setMessage] = useState<string>('');

  const utils = api.useContext();

  const { data: youngPhoto, isLoading: isYoungLoading } =
    api.photo.getByAge.useQuery({
      age: 'young',
    });
  const { data: oldPhoto, isLoading: isOldLoading } =
    api.photo.getByAge.useQuery({
      age: 'old',
    });

  const { data: messages, isLoading: areMessagesLoading } =
    api.conversation.get.useQuery({
      age: conversationAge,
    });
  const { mutateAsync: getText, isLoading: isGettingText } =
    api.conversation.text.useMutation();
  const { mutateAsync: clearConversation, isLoading: isClearingConversation } =
    api.conversation.clear.useMutation();

  const {
    video,
    isLoading: isVideoLoading,
    clearVideo,
    triggerVideoGeneration,
  } = useVideoResponse(conversationAge);

  const handleSendMessage = useCallback(async () => {
    if (!(message && message.trim().length > 0)) return;

    setConversationStatus('waiting');
    const { text } = await getText({ age: conversationAge, message });
    void utils.conversation.get.invalidate();
    setMessage('');

    await triggerVideoGeneration(text);

    setConversationStatus('idle');
  }, [
    conversationAge,
    getText,
    message,
    triggerVideoGeneration,
    utils.conversation.get,
  ]);

  const handleClearConversation = useCallback(async () => {
    if (!messages?.[0]) return;

    await clearConversation({ id: messages[0].conversationId });
    await utils.conversation.invalidate();
  }, [clearConversation, messages, utils.conversation]);

  const handleVideoStatusUpdate = useCallback(
    async (status: AVPlaybackStatus) => {
      if (status.isLoaded && status.positionMillis === status.durationMillis)
        await clearVideo();
    },
    [clearVideo],
  );

  return (
    <>
      <View className="flex-row">
        <Pressable
          onPress={() => {
            setConversationAge('young');
          }}
          disabled={isVideoLoading}
          style={{
            zIndex: conversationAge === 'young' ? 1 : undefined,
          }}>
          {isYoungLoading ? (
            <View className="h-40 w-40 items-center justify-center">
              <Text>Loading...</Text>
            </View>
          ) : conversationAge === 'young' && video ? (
            <Video
              className="m-2 h-40 w-40"
              source={{ uri: video }}
              shouldPlay={true}
              isMuted={false}
              volume={1}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handleVideoStatusUpdate}
              style={{
                transform: [{ scale: conversationAge === 'young' ? 1 : 0.8 }],
              }}
            />
          ) : (
            <Image
              source={{ uri: youngPhoto?.uri }}
              alt=""
              className="m-2 h-40 w-40"
              style={{
                transform: [{ scale: conversationAge === 'young' ? 1 : 0.8 }],
              }}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setConversationAge('old');
          }}
          disabled={isVideoLoading}
          style={{
            zIndex: conversationAge === 'old' ? 1 : undefined,
          }}>
          {isOldLoading ? (
            <View className="h-40 w-40 items-center justify-center">
              <Text>Loading...</Text>
            </View>
          ) : conversationAge === 'old' && video ? (
            <Video
              className="m-2 h-40 w-40"
              source={{ uri: video }}
              shouldPlay={true}
              isMuted={false}
              volume={1}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handleVideoStatusUpdate}
              style={{
                transform: [{ scale: conversationAge === 'old' ? 1 : 0.8 }],
              }}
            />
          ) : (
            <Image
              source={{ uri: oldPhoto?.uri }}
              alt=""
              className="m-2 h-40 w-40"
              style={{
                transform: [{ scale: conversationAge === 'old' ? 1 : 0.8 }],
              }}
            />
          )}
        </Pressable>
      </View>
      <FlatList
        className="mb-4 flex-1"
        data={messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item: message }) => {
          return (
            <View
              key={message.id}
              style={{
                padding: 12,
                borderRadius: 20,
                maxWidth: 300,
                marginVertical: 4,
                alignSelf:
                  message.sender === 'assistant' ? 'flex-start' : 'flex-end',
                backgroundColor:
                  message.sender === 'user' ? '#4285F4' : '#ffffff30',
              }}>
              <Text>{message.text}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text>
              {areMessagesLoading
                ? 'Loading previous messages...'
                : 'No messages yet'}
            </Text>
          </View>
        }
      />
      <View>
        <TextInput
          editable={conversationStatus === 'idle'}
          focusable={conversationStatus === 'idle'}
          className="text-whit mb-4 w-full rounded-lg border-[1px] border-white p-4 text-white"
          placeholderTextColor="#ffffff"
          value={message}
          onChangeText={setMessage}
          placeholder="Talk to yourself"
          multiline
        />
        <View className="flex-row justify-between">
          <Button
            fill
            disabled={
              conversationStatus === 'waiting' || message.trim().length === 0
            }
            onPress={handleSendMessage}>
            <Button.Text className="text-center text-lg">
              {isGettingText ? 'Sending...' : 'Send'}
            </Button.Text>
          </Button>
          <View className="w-4"></View>
          <Button
            fill
            disabled={messages?.length === 0}
            onPress={handleClearConversation}>
            <Button.Text className="text-center text-lg">
              {isClearingConversation ? 'Clearing...' : 'Clear'}
            </Button.Text>
          </Button>
        </View>
      </View>
    </>
  );
}
