import { useCallback, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ResizeMode, Video } from "expo-av";

import { api } from "~/utils/api";
import { AgeMode } from "~/types";

export default function Main() {
  const [conversationStatus, setConversationStatus] = useState<
    "idle" | "waiting"
  >("idle");
  const [conversationMode, setConversationMode] = useState<"OLD" | "YOUNG">(
    "OLD",
  );
  const [message, setMessage] = useState<string>("");
  const [video, setVideo] = useState<string>();

  const playback = useRef<Video | null>(null);

  const { data: youngPhoto, isLoading: isYoungLoading } =
    api.photo.getByAge.useQuery({
      age: AgeMode.YOUNG,
    });
  const { data: oldPhoto, isLoading: isOldLoading } =
    api.photo.getByAge.useQuery({
      age: AgeMode.OLD,
    });
  const { data: messages, isLoading: areMessagesLoading } =
    api.conversation.get.useQuery({ age: conversationMode });

  const { mutateAsync: getText } = api.conversation.text.useMutation();
  const { mutateAsync: getVoice } = api.conversation.voice.useMutation();
  const { mutateAsync: getVideo } = api.conversation.video.useMutation();

  const utils = api.useContext();

  playback.current?.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.durationMillis === status.positionMillis) {
      console.log("finished");
      setVideo(undefined);
      setConversationStatus("idle");
    }
  });

  const handleSendMessage = useCallback(async () => {
    setConversationStatus("waiting");
    const textFromAssistant = await getText({ age: conversationMode, message });
    setMessage("");
    void utils.conversation.get.invalidate();
    const voiceFromAssistant = await getVoice({ text: textFromAssistant.text });
    const videoURL = await getVideo({
      image: conversationMode === "OLD" ? oldPhoto!.uri : youngPhoto!.uri,
      voice: voiceFromAssistant,
    });

    setVideo(videoURL);
  }, [
    conversationMode,
    getText,
    getVideo,
    getVoice,
    message,
    oldPhoto,
    utils.conversation.get,
    youngPhoto,
  ]);

  if (isOldLoading || isYoungLoading) return <Text>Loading...</Text>;

  return (
    <View className="grid h-full bg-pink-200">
      <View className="flex flex-row flex-wrap">
        <Pressable
          onPress={() => {
            setConversationMode("YOUNG");
          }}
          style={{
            zIndex: conversationMode === "YOUNG" ? 1 : undefined,
          }}
        >
          {conversationMode === "YOUNG" && video ? (
            <Video
              className="m-2 h-40 w-40"
              source={{ uri: video }}
              ref={playback}
              shouldPlay={true}
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Image
              source={{ uri: youngPhoto?.uri }}
              alt=""
              className="m-2 h-40 w-40"
              style={{
                transform: [{ scale: conversationMode === "YOUNG" ? 1.3 : 1 }],
              }}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setConversationMode("OLD");
          }}
          style={{
            zIndex: conversationMode === "OLD" ? 1 : undefined,
          }}
        >
          {conversationMode === "OLD" && video ? (
            <Video
              className="m-2 h-40 w-40"
              source={{ uri: video }}
              ref={playback}
              shouldPlay={true}
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Image
              source={{ uri: oldPhoto?.uri }}
              alt=""
              className="m-2 h-40 w-40"
              style={{
                transform: [{ scale: conversationMode === "OLD" ? 1.3 : 1 }],
              }}
            />
          )}
        </Pressable>
      </View>
      <View className="mt-6 flex w-full p-8">
        <FlatList
          data={messages}
          keyExtractor={(message) => message.id}
          renderItem={({ item: message }) => {
            return (
              <Text
                className={
                  message.sender === "USER" ? "bg-gray-200" : "bg-green-100"
                }
                key={message.id}
              >
                {message.text}
              </Text>
            );
          }}
          ListEmptyComponent={<Text>No messages yet</Text>}
        ></FlatList>
      </View>
      <View>
        <TextInput
          editable={!areMessagesLoading || conversationStatus !== "waiting"}
          focusable={conversationStatus !== "waiting"}
          className="w-full border-2 p-4"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button
          disabled={
            areMessagesLoading ||
            message.trim().length === 0 ||
            conversationStatus === "waiting"
          }
          title={
            conversationStatus === "idle" ? "Send" : "Waiting for response"
          }
          onPress={handleSendMessage}
        />
      </View>
    </View>
  );
}
