import { Image, Text, View } from "react-native";
import EditMessage from "~/components/EditMessage";
import useChatGpt from "~/hooks/useChatGpt";

export default function Main({pictureId, pictureUri}: { pictureId: string, pictureUri: string}) {
    const { send } = useChatGpt();

    if(!pictureId || !pictureUri || pictureId === "" || pictureUri === "") 
        return (
            <View className="bg-red-400 w-full h-full flex-col justify-center items-center">
                <Text>No image provided</Text>
            </View>
        );

    const onSend = async (message: string) => {
        if(message === "") return;

        //const result = await send(inputRef.current);
        alert(message);
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
            <EditMessage onSend={onSend} />
        </View>
    </View>
  );
}