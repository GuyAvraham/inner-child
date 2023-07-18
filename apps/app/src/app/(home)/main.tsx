import { TouchableOpacity, Image, Text, TextInput, View } from "react-native";

export default function Main({pictureId, pictureUri}: { pictureId: string, pictureUri: string}) {

    if(!pictureId || !pictureUri || pictureId === "" || pictureUri === "") 
        return (
            <View className="bg-red-400 w-full h-full flex-col justify-center items-center">
                <Text>No image provided</Text>
            </View>
        );

    return (
    <View className="bg-red-400 w-full h-full flex-col items-center">
        <Image
          key={pictureId}
          source={{ uri: pictureUri }}
          alt=""
          className="bg-white w-full h-4/5"
        />
        <View className="flex-1 justify-end">
            <View className="w-5/6 flex-row  m-3 p-4 bg-slate-300 rounded-xl">
                <TextInput className="flex-1 text-lg " placeholder="Enter your message" />
                <TouchableOpacity className="items-center justify-center">
                    <Text className="text-lg font-bold">Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}