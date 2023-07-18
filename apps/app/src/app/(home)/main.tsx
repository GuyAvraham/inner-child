import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import EditMessage from "~/components/EditMessage";
import useChatGpt from "~/hooks/useChatGpt";
import useReplicateApi from "~/hooks/useReplicateApi";
import { Video, ResizeMode } from 'expo-av';

// I guess this component gets directly either old or child image using views carousel
export default function Main({pictureId, pictureUri}: { pictureId: string, pictureUri: string}) {
    const { send } = useChatGpt();
    const { sendRequest: sendRequestAge, replicateResult: replicateResultAge, isLoading: isLoadingAge } = useReplicateApi("9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c");
    const { sendRequest: sendRequestTalk, replicateResult: replicateResultTalk} = useReplicateApi("3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376");
    const [ videoUri, setVideoUri ] = useState<string>("");

    useEffect(() => {
        
        void sendRequestAge({
            'image': pictureUri,
            'target_age': "10"
        });

    }, []);

    useEffect(() => {
        if(!replicateResultTalk) return;

        setVideoUri(prev => prev = replicateResultTalk);

    }, [replicateResultTalk]);

    if(!pictureId || !pictureUri || pictureId === "" || pictureUri === "") 
        return (
            <View className="bg-red-400 w-full h-full flex-col justify-center items-center">
                <Text>No image provided</Text>
            </View>
        );

    const onSend = async (message: string) => {
        if(message === "") return;

        const result = await send(message);
        
        const encodedParams = new URLSearchParams();
        encodedParams.set('src', "Hel");
        encodedParams.set('hl', 'en-us');
        
        const url = `http://api.voicerss.org/?key=cd6f3357f8ea4454bd2b182f8611a40e&hl=en-us&src=${result}`;
        const options = {
          method: 'POST'
        };
        
        void fetch(url, options)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();

            reader.onloadend = () => {        
                const audioUri: string = reader.result as any;
                void sendRequestTalk({
                    'source_image': replicateResultAge,
                    'driven_audio': audioUri
                });
            }

            reader.readAsDataURL(blob);
        })
        .catch(e => console.error(e));
    };

    return (
    <View className="bg-red-400 w-full h-full flex-col items-center justify-center p-2">
        {
            isLoadingAge ?
            (
                <Text>Loading...</Text>
            )
            :
            replicateResultAge ?
            videoUri === "" ?
            (
                <Image
                    key={pictureId}
                    source={{ uri: replicateResultAge }}
                    alt=""
                    className="bg-white w-full h-96 rounded-xl"
                />
            )
            :
            (
                <Video
                    className="w-full h-96 rounded-xl bg-white"
                    source={{
                        uri: "https://replicate.delivery/pbxt/ETfrvHWhkOxPMaZX0WUf2mH49OUhua70xtmW3kwKDwK2EGRRA/out.mp4",
                    }}
                    shouldPlay={true}
                    resizeMode={ResizeMode.CONTAIN}
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