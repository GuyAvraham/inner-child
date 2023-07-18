import { useRef } from "react";
import { TouchableOpacity, Image, Text, TextInput, View } from "react-native";
import { useChatGpt } from "~/hooks/useChatGpt";

export default function Main({pictureId, pictureUri}: { pictureId: string, pictureUri: string}) {
    const inputRef = useRef<string>("");
    const { send } = useChatGpt();

    if(!pictureId || !pictureUri || pictureId === "" || pictureUri === "") 
        return (
            <View className="bg-red-400 w-full h-full flex-col justify-center items-center">
                <Text>No image provided</Text>
            </View>
        );

    const sendMessage = async () => {
        if(inputRef.current === "") return;

        const result = await send(inputRef.current);
        alert(result);
    };

    return (
    <View className="bg-red-400 w-full h-full flex-col items-center justify-center p-2">
        <Image
          key={pictureId}
          source={{ uri: pictureUri }}
          alt=""
          className="bg-white w-full h-96 rounded-xl"
        />
        <View className="justify-end h-fit">
            <View className="w-5/6 flex-row  mt-10 p-4 bg-slate-300 rounded-xl">
                <TextInput onChangeText={(text) => inputRef.current = text} className="flex-1 text-lg " placeholder="Enter your message" />
                <TouchableOpacity onPress={sendMessage} className="items-center justify-center">
                    <Text className="text-lg font-bold">Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}