import { atom } from 'jotai';

export const currentPhotoAtom = atom<string | undefined>(undefined);
export const youngPhotoAtom = atom<string | undefined>(undefined);
export const oldPhotoAtom = atom<string | undefined>(undefined);

export const generateYoungAtom = atom<boolean>(false);
