'use client';

import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';

import { generateToken } from '~/utils/token';
import Button from '~/components/Button';
import Toggle from '~/components/Toggle';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import { useRouteState } from '~/hooks/useRouteState';
import useUserData from '~/hooks/useUserData';
import CloseSVG from '~/svg/CloseSVG';
import OptionsSVG from '~/svg/OptionsSVG';
import RefreshChatSVG from '~/svg/RefreshChatSVG';
import { api } from '~/trpc/react';
import { Onboarded } from '~/types';

interface ChatOptionsProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isClearingConversation: boolean;
  handleClearConversation: () => void;
}

export default function ChatOptions({
  isOpen,
  open,
  close,
  isClearingConversation,
  handleClearConversation,
}: ChatOptionsProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const utils = api.useContext();
  const { openUpload } = useRouteState();
  const { updateUserData, user } = useUserData();
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();

  const handler = useCallback(() => close(), [close]);

  useOnClickOutside(modalRef, handler);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    handleClearConversation();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });

    openUpload();
  }, [deleteAllPhotos, utils.photo, handleClearConversation, updateUserData, openUpload]);

  const toggleAnimationBG = useCallback(() => {
    const attr = 'data-animation';
    const bg = document.querySelector(`#bg-image[${attr}]`);
    if (bg) {
      const isAnimationOn = bg.getAttribute(attr) === 'on';
      bg.setAttribute(attr, isAnimationOn ? 'off' : 'on');
    }
  }, []);

  return (
    <div className="absolute right-3 z-30">
      <button className="outline-hidden border-0 bg-transparent" onClick={isOpen ? close : open}>
        {isOpen ? <CloseSVG /> : <OptionsSVG />}
      </button>
      <div
        ref={modalRef}
        className={clsx(
          'absolute right-[110%] top-0 rounded-lg border border-black bg-black/80 p-4',
          !isOpen && 'hidden',
        )}
      >
        <div className="mb-2 flex justify-end">
          <Toggle
            label="Background animation"
            title="Toggle background animation"
            defaultChecked
            onChange={toggleAnimationBG}
            disabled={isClearingConversation || isReplacing}
          />
        </div>
        <Button
          className="mb-2 flex w-full items-center justify-center gap-2 whitespace-nowrap p-4 font-[Poppins-Bold]"
          disabled={isClearingConversation || isReplacing}
          onClick={replacePhotos}
        >
          <RefreshChatSVG />
          {isReplacing ? 'Resetting image...' : 'Reset image'}
        </Button>
        <Button
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap p-4 font-[Poppins-Bold]"
          disabled={isClearingConversation || isReplacing}
          onClick={handleClearConversation}
        >
          <RefreshChatSVG />
          {isClearingConversation ? 'Resetting chat...' : 'Reset chat'}
        </Button>
      </div>
    </div>
  );
}
