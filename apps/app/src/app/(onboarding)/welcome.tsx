import { useCallback, useState } from "react";
import { Button, Image, Text } from "react-native";
import type { ImagePickerAsset } from "expo-image-picker";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";

import { trpc } from "~/utils/api";
import { uploadFileToS3 } from "~/utils/uploadFileToS3";
import { ROUTE } from "~/config/routes";

export default function Welcome() {
  const [image, setImage] = useState<ImagePickerAsset | undefined>();
  const [_takenWithCamera, setTakenWithCamera] = useState<boolean>(false);

  const router = useRouter();

  const uploadURIMutation = trpc.picture.getUploadURI.useMutation();

  const pickImage = async () => {
    const mediaLibraryPermission = await requestMediaLibraryPermissionsAsync();

    if (!mediaLibraryPermission.granted) {
      alert("no media library permission");
      // TODO: show notification
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setTakenWithCamera(false);
    }
  };

  const takePhoto = async () => {
    const cameraPermission = await requestCameraPermissionsAsync();

    if (!cameraPermission.granted) {
      alert("no camera permission");
      // TODO: show notification
      return;
    }

    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setTakenWithCamera(true);
    }
  };

  const submitPicture = useCallback(async () => {
    if (!image) return;

    const imageBlob = await (await fetch(image.uri)).blob();

    const url = await uploadURIMutation.mutateAsync({
      age: "YOUNG",
      ext:
        image.fileName?.split(".").at(-1) ??
        imageBlob.type.split("/").at(-1) ??
        "jpg",
    });

    await uploadFileToS3(url, imageBlob);
    router.replace(ROUTE.ROOT);
  }, [image, router, uploadURIMutation]);

  return (
    <>
      <Text>Welcome</Text>

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take an image with camera" onPress={takePhoto} />

      {image && (
        <>
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200 }}
          />
          <Button title="Submit" onPress={submitPicture} />
        </>
      )}
    </>
  );
}
