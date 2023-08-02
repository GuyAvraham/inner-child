import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { api } from "~/utils/api";
import { AgeMode } from "~/types";

export default function Main() {
  const [conversationMode, setConversationMode] = useState<"old" | "young">(
    "old",
  );

  const { data: youngPhoto, isLoading: isYoungLoading } =
    api.photo.getByAge.useQuery({
      age: AgeMode.YOUNG,
    });

  const { data: oldPhoto, isLoading: isOldLoading } =
    api.photo.getByAge.useQuery({
      age: AgeMode.OLD,
    });

  if (isOldLoading || isYoungLoading) return <Text>Loading...</Text>;

  return (
    <View className="flex flex-row flex-wrap">
      <Pressable
        onPress={() => {
          setConversationMode("young");
        }}
        style={{
          zIndex: conversationMode === "young" ? 1 : undefined,
        }}
      >
        <Image
          source={{ uri: youngPhoto?.uri }}
          alt=""
          className="m-2 h-40 w-40"
          style={{
            transform: [{ scale: conversationMode === "young" ? 1.3 : 1 }],
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setConversationMode("old");
        }}
        style={{
          zIndex: conversationMode === "young" ? 1 : undefined,
        }}
      >
        <Image
          source={{ uri: oldPhoto?.uri }}
          alt=""
          className="m-2 h-40 w-40"
          style={{
            transform: [{ scale: conversationMode === "old" ? 1.3 : 1 }],
          }}
        />
      </Pressable>
    </View>
  );
}
