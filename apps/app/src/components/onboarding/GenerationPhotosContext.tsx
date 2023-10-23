import { createContext, useContext } from 'react';
import type { FC, ReactNode } from 'react';

import { useGenerateAgedPhotos } from '~/hooks/useGenerateAgedPhotos';

interface GenerationPhotosContextType {
  youngPhotos: (string | null)[];
  oldPhotos: (string | null)[];
  presetCount: number;
}

const GenerationPhotosContext = createContext<GenerationPhotosContextType>({
  youngPhotos: [],
  oldPhotos: [],
  presetCount: 0,
});

export const useGenerationPhotos = () => useContext(GenerationPhotosContext);

export const GenerationPhotosContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const value = useGenerateAgedPhotos();

  return <GenerationPhotosContext.Provider value={value}>{children}</GenerationPhotosContext.Provider>;
};
