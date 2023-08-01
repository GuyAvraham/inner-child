import type { ImageProps, ImageSourcePropType } from "react-native";
import { Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SelectionPhotoProps extends Omit<ImageProps, "source"> {
  source?: ImageSourcePropType;
}

export default function SelectionPhoto({ ...props }: SelectionPhotoProps) {
  return (
    <View className="flex items-center p-4">
      {!props.source ? (
        // TODO: set proper designed placeholder
        <FontAwesome name="user-circle" size={160} color="black" />
      ) : (
        <Image className="h-40 w-40" source={props.source} {...props} />
      )}
    </View>
  );
}
