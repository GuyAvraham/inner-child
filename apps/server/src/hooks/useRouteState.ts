import { useCallback } from 'react';

import { useRouteStateAtom } from '~/atoms';

export const useRouteState = () => {
  const [state, setState] = useRouteStateAtom();

  const openGender = useCallback(() => setState('gender'), [setState]);
  const openUpload = useCallback(() => setState('upload'), [setState]);
  const openGenerateOld = useCallback(() => setState('generateOld'), [setState]);
  const openChat = useCallback(() => setState('chat'), [setState]);

  return {
    state,
    openGender,
    openUpload,
    openGenerateOld,
    openChat,
  };
};
