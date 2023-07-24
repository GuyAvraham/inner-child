import { Image, View } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

export default function SelectionPhoto({
  photo,
}: {
  photo?: ImagePickerAsset;
}) {
  return (
    <View className="flex items-center p-4">
      {!photo ? (
        // TODO: set proper designed placeholder
        <FontAwesome name="user-circle" size={160} color="black" />
      ) : (
        <Image
          source={{
            uri: photo.uri,
          }}
          className="h-40 w-40"
        />
      )}
    </View>
  );
}
