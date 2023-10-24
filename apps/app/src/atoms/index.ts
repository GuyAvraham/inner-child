import { atom, useAtom } from 'jotai';

export const currentPhotoAtom = atom<string | undefined>(undefined);
export const useCurrentPhotoAtom = () => useAtom(currentPhotoAtom);

export const youngPhotoAtom = atom<string | undefined>(undefined);
export const oldPhotoAtom = atom<string | undefined>(undefined);

const videoPredictionIdAtom = atom<string | null>(null);
export const useVideoPredictionIdAtom = () => useAtom(videoPredictionIdAtom);

const videoUriAtom = atom<string | null>(null);
export const useVideoUriAtom = () => useAtom(videoUriAtom);

const videoLoadingAtom = atom<boolean>(false);
export const useVideoLoadingAtom = () => useAtom(videoLoadingAtom);
