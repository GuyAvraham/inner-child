import { useCallback, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useAtom, useAtomValue } from "jotai";

import { api } from "~/utils/api";
import SelectionPhoto from "~/components/SelectionPhoto";
import { ROUTE } from "~/config/routes";
import useErrorsHandler from "~/hooks/useErrorsHandler";
import useUploadPhoto from "~/hooks/useUploadPhoto";
import { currentPhotoAtom, oldPhotoAtom, youngPhotoAtom } from "~/store/photos";
import { AgeMode } from "~/types";

export default function GeneratingScreen() {
  const { handleError: _ } = useErrorsHandler();

  const generateYoung = Boolean(
    useLocalSearchParams<{ young: string }>().young,
  );
  const { user } = useUser();
  const router = useRouter();

  const { mutateAsync: _generateAgedPhoto } =
    api.photo.generateAged.useMutation();

  const [status, setStatus] = useState<"idle" | "generating" | "uploading">(
    "generating",
  );

  const currentPhoto = useAtomValue(currentPhotoAtom);
  const [youngPhoto, _setYoungPhoto] = useAtom(youngPhotoAtom);
  const [oldPhoto, _setOldPhoto] = useAtom(oldPhotoAtom);

  const { uploadPhoto } = useUploadPhoto();

  useEffect(() => {
    if (!currentPhoto || !generateYoung) return;

    console.log("young photo generation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentPhoto) return;

    console.log("old photo generation");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (youngPhoto || oldPhoto) setStatus("idle");
  }, [oldPhoto, youngPhoto]);

  const handleSubmit = useCallback(async () => {
    if (!youngPhoto || !oldPhoto) return;

    setStatus("uploading");

    if (!generateYoung) await uploadPhoto(youngPhoto, AgeMode.YOUNG);
    await uploadPhoto(oldPhoto, AgeMode.OLD);

    await user?.update({
      unsafeMetadata: {
        onboarded: true,
      },
    });

    router.replace(ROUTE.ROOT);
  }, [generateYoung, oldPhoto, router, uploadPhoto, user, youngPhoto]);

  return (
    <>
      <Text>Generating your photos</Text>
      {generateYoung ? (
        <>
          <Text>You young</Text>
          !youngPhoto ? (
          <SelectionPhoto source={{ uri: currentPhoto }} blurRadius={100} />
          ) : (
          <SelectionPhoto source={{ uri: youngPhoto }} />)
        </>
      ) : null}
      <Text>You old</Text>
      {!oldPhoto ? (
        <SelectionPhoto source={{ uri: currentPhoto }} blurRadius={100} />
      ) : (
        <SelectionPhoto source={{ uri: oldPhoto }} />
      )}
      <Button
        title={status === "uploading" ? "submitting..." : "continue"}
        disabled={status === "generating"}
        onPress={handleSubmit}
      />
    </>
  );
}
