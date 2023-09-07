import { atom, useAtom } from 'jotai';

export const currentPhotoAtom = atom<string | undefined>(undefined);
export const youngPhotoAtom = atom<string | undefined>(undefined);
export const oldPhotoAtom = atom<string | undefined>(undefined);

const generateYoungAtom = atom<boolean>(false);
export const useGenerateYoungAtom = () => useAtom(generateYoungAtom);

const videoPredictionIdAtom = atom<string | null>(null);
export const useVideoPredictionIdAtom = () => useAtom(videoPredictionIdAtom);
