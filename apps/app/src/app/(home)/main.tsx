import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import EditMessage from "~/components/EditMessage";
import useChatGpt from "~/hooks/useChatGpt";
import useReplicateApi from "~/hooks/useReplicateApi";

// I guess this component gets directly either old or child image using views carousel
export default function Main({pictureId, pictureUri}: { pictureId: string, pictureUri: string}) {
    const { send } = useChatGpt();
    const { sendRequest, replicateResult, isLoading } = useReplicateApi("9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c");

    useEffect(() => {
        
        // void sendRequest({
        //     'image': pictureUri,
        //     'target_age': "10"
        // });

    }, []);

    if(!pictureId || !pictureUri || pictureId === "" || pictureUri === "") 
        return (
            <View className="bg-red-400 w-full h-full flex-col justify-center items-center">
                <Text>No image provided</Text>
            </View>
        );

    const onSend = async (message: string) => {
        if(message === "") return;

        //const result = await send(message);
        alert(message);
    };

    return (
    <View className="bg-red-400 w-full h-full flex-col items-center justify-center p-2">
        {
            isLoading ?
            (
                <Text>Loading...</Text>
            )
            :
            replicateResult ?
            (
                <Image
                    key={pictureId}
                    source={{ uri: replicateResult }}
                    alt=""
                    className="bg-white w-full h-96 rounded-xl"
                />
            )
            :
            (
                <Text>Failed to transform image</Text>
            )
        }
        <View className="justify-end h-fit">
            <EditMessage onSend={onSend} />
        </View>
    </View>
  );
}