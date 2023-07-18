import { useState } from "react";
import { TouchableOpacity, Text, TextInput, View } from "react-native";

export default function EditMessage({onSend}: { onSend: (message: string) => void}) {
    const [message, setMessage] = useState<string>("");

    const onPress = () => {
        onSend(message);
        setMessage(prev => prev = "");
    };

    return (
        <View className="w-5/6 flex-row  mt-10 p-4 bg-slate-300 rounded-xl">
            <TextInput value={message} onChangeText={(text) => setMessage(prev => prev = text)} className="flex-1 text-lg " placeholder="Enter your message" />
            <TouchableOpacity onPress={onPress} className="items-center justify-center">
                <Text className="text-lg font-bold">Send</Text>
            </TouchableOpacity>
        </View>
  );
}