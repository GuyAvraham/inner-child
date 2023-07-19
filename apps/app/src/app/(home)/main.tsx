import { Image, Text, View } from "react-native";

import { trpc } from "~/utils/api";

export default function Main() {
  const { data, isLoading } = trpc.picture.getAll.useQuery();

  if (isLoading) return <Text>Loading...</Text>;

  console.log(JSON.stringify(data, null, 2));

  return (
    <View className="flex flex-row flex-wrap bg-red-400">
      {data?.map((picture) => (
        <Image
          key={picture.id}
          source={{ uri: picture.uri }}
          alt=""
          className="h-40 w-40"
        />
      ))}
    </View>
  );
}
