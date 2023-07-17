import { View } from "react-native";
import * as Animatable from 'react-native-animatable';

import LogInButton from "~/components/LogInButton";

export default function Login() {
  return (
    <View className="bg-sky-300 p-6 w-full h-full">
      <Animatable.Text className="text-yellow-400 text-6xl font-bold self-center mt-4" animation="fadeInDown">Inner Child</Animatable.Text>
      <Animatable.Text className="text-white text-2xl self-center" animation="flipInY">Reconnect with your inner</Animatable.Text>
      <Animatable.View className="flex-1 justify-end" animation="slideInUp">
        <LogInButton />
      </Animatable.View>
    </View>
  );
}