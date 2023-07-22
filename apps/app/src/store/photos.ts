import type { ImagePickerAsset } from "expo-image-picker";
import { atom } from "jotai";

export const photoAtom = atom<ImagePickerAsset | undefined>(undefined);
export const youngPhotoAtom = atom<ImagePickerAsset | undefined>(undefined);
