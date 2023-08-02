import { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { api } from "~/utils/api";
import { AgeMode } from "~/types";

export default function Main() {
  const [conversationMode, setConversationMode] = useState<"OLD" | "YOUNG">(
    "OLD",
  );
  const [message, setMessage] = useState<string>("");

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

  const { mutateAsync: talk } = api.conversation.talk.useMutation();

  const utils = api.useContext();

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
          <Image
            source={{ uri: youngPhoto?.uri }}
            alt=""
            className="m-2 h-40 w-40"
            style={{
              transform: [{ scale: conversationMode === "YOUNG" ? 1.3 : 1 }],
            }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setConversationMode("OLD");
          }}
          style={{
            zIndex: conversationMode === "OLD" ? 1 : undefined,
          }}
        >
          <Image
            source={{ uri: oldPhoto?.uri }}
            alt=""
            className="m-2 h-40 w-40"
            style={{
              transform: [{ scale: conversationMode === "OLD" ? 1.3 : 1 }],
            }}
          />
        </Pressable>
      </View>
      <View className="mt-6 flex w-full flex-grow p-8">
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
          editable={!areMessagesLoading}
          className="w-full border-2 p-4"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button
          disabled={areMessagesLoading || message.trim().length === 0}
          title="Send"
          onPress={() => {
            const prevMessage = message;
            setMessage("");
            void talk({ age: conversationMode, message: prevMessage }).then(
              () => {
                void utils.conversation.get.invalidate();
              },
            );
          }}
        />
      </View>
    </View>
  );
}
