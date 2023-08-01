import type { ImagePickerAsset } from "expo-image-picker";
import { atom } from "jotai";

export const originalPhotoAtom = atom<ImagePickerAsset | undefined>(undefined);
export const currentPhotoAtom = atom<string | undefined>(undefined);
export const youngPhotoAtom = atom<string | undefined>(undefined);
export const oldPhotoAtom = atom<string | undefined>(undefined);
