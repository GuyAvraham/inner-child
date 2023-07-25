import type { ImagePickerAsset } from "expo-image-picker";
import { atom } from "jotai";

export const currentPhotoAtom = atom<ImagePickerAsset | undefined>(undefined);
export const youngPhotoAtom = atom<ImagePickerAsset | undefined>(undefined);
export const oldPhotoAtom = atom<ImagePickerAsset | undefined>(undefined);
