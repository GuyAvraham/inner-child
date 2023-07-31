import { useContext, useRef, useState } from "react";
import { Image, Text, TextInput, View } from "react-native";

import { api } from "~/utils/api";
import { GptContext } from "~/utils/gpt";

export default function Main() {
  const { data, isLoading: isLoadingPhotos } = api.photo.getAll.useQuery();
  const { messages, isLoading: isLoadingMessages, send } = useContext(GptContext);
  const [message, setMessage] = useState<string>("");

  if (isLoadingPhotos) return <Text>Photos Loading...</Text>;
  
  const messagesView = () => {
    if(isLoadingMessages) return <Text>Messages Loading...</Text>;

    return (
      messages?.map((message, index) => (
        <View key={index} className="w-full p-3 flex-row">
          <Text>{index}. </Text>
          <Text>{message.role}: </Text>
          <Text className="flex-1 items-end justify-end">{message.content}</Text>
        </View>
      ))
    );
  };

  const onSendPress = async () => {
    await send(message)
    setMessage("");
  };

  return (
    <>
      <View className="flex flex-row flex-wrap">
        {data?.map((picture) => (
          <Image
            key={picture.id}
            source={{ uri: picture.uri }}
            alt=""
            className="m-2 h-40 w-40"
          />
        ))}
      </View>
      <TextInput className="w-full h-10 border-2 p-3" value={message} onChangeText={(text) => setMessage(prev => prev = text)}/>
      <Text className="self-center text-xl" onPress={onSendPress}>send</Text>
      { messagesView() }
    </>
  );
}