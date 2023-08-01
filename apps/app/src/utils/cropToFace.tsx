import { detectFacesAsync, FaceDetectorMode } from "expo-face-detector";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const cropToFace = async (uri: string) => {
  const detectedFaces = await detectFacesAsync(uri, {
    mode: FaceDetectorMode.accurate,
  });

  if (!detectedFaces.faces[0]) throw new Error("no face detected");
  if (detectedFaces.faces.length > 1) throw new Error("too many faces");

  if (detectedFaces.faces[0].bounds.size.height < 1000)
    throw new Error("face too small");

  const OFFSET = detectedFaces.faces[0].bounds.size.width / 3;

  if (
    detectedFaces.faces[0].bounds.origin.x < OFFSET ||
    detectedFaces.faces[0].bounds.origin.y < OFFSET
  )
    throw new Error("face too close");

  const croppedPhoto = await manipulateAsync(
    uri,
    [
      {
        crop: {
          originX: detectedFaces.faces[0].bounds.origin.x - OFFSET,
          height: detectedFaces.faces[0].bounds.size.height + OFFSET * 2,
          originY: detectedFaces.faces[0].bounds.origin.y - OFFSET,
          width: detectedFaces.faces[0].bounds.size.width + OFFSET * 2,
        },
      },
      {
        resize: {
          height: 1000,
          width: 1000,
        },
      },
    ],
    {
      compress: 1,
      format: SaveFormat.JPEG,
      base64: true,
    },
  );

  return croppedPhoto;
};
