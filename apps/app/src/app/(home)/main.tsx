import { Image, Text, View } from "react-native";

import { trpc } from "~/utils/api";

export default function Main() {
  const { data, isLoading } = trpc.picture.getAll.useQuery();

  if (isLoading) return <Text>Loading...</Text>;

  return (
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
  );
}
