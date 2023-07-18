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
import { useAuth } from "@clerk/clerk-expo";

import { trpc } from "~/utils/api";
import { uploadFileToS3 } from "~/utils/uploadFileToS3";
import { ROUTE } from "~/config/routes";

export default function Welcome() {
  const [image, setImage] = useState<ImagePickerAsset | undefined>();
  const [_, setTakenWithCamera] = useState<boolean>(false);

  const { userId } = useAuth();
  const router = useRouter();

  const pictureS3UploadLinkMutation =
    trpc.picture.createS3UploadLink.useMutation();
  const pictureMetadataMutation = trpc.picture.saveMetadata.useMutation();

  // if (userPictures && userPictures.length > 0) {
  //   router.replace(ROUTE.HOME.MAIN);
  // }

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

    const pictureS3UploadLink = await pictureS3UploadLinkMutation.mutateAsync({
      fileName: image.fileName ?? `${userId}-CURRENT.${image.type}`,
    });
    console.log(pictureS3UploadLink);

    await uploadFileToS3(
      pictureS3UploadLink.urlToUpload,
      await fetch(image.uri).then((r) => r.blob()),
    );

    await pictureMetadataMutation.mutateAsync({
      age: "CURRENT",
      s3URI: pictureS3UploadLink.urlToSave,
    });

    router.replace(ROUTE.HOME.MAIN);
  }, [
    image,
    pictureS3UploadLinkMutation,
    userId,
    pictureMetadataMutation,
    router,
  ]);

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
