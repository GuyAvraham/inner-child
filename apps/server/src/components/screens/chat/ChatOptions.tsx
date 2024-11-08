'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { generateToken } from '~/utils/token';
import Button from '~/components/Button';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import useUserData from '~/hooks/useUserData';
import CloseSVG from '~/svg/CloseSVG';
import OptionsSVG from '~/svg/OptionsSVG';
import RefreshChatSVG from '~/svg/RefreshChatSVG';
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
  const router = useRouter();
  const { updateUserData } = useUserData();
  const { mutateAsync: deleteAllPhotos } = api.photo.deleteAll.useMutation();

  const handler = useCallback(() => close(), [close]);

  useOnClickOutside(modalRef, handler);

  const replacePhotos = useCallback(async () => {
    setIsReplacing(true);
    await deleteAllPhotos();
    await utils.photo.invalidate();
    handleClearConversation();
    await updateUserData({ token: generateToken(), onboarded: Onboarded.Current });

    router.replace('/onboarding');
  }, [deleteAllPhotos, utils.photo, handleClearConversation, updateUserData, router]);

  return (
    <div className="absolute right-3 z-20">
      <button className="border-0 bg-transparent outline-none" onClick={isOpen ? close : open}>
        {isOpen ? <CloseSVG /> : <OptionsSVG />}
      </button>
      <div
        ref={modalRef}
        className={clsx(
          'absolute right-[110%] top-0 rounded-lg border border-black bg-black/80 p-4',
          !isOpen && 'hidden',
        )}
      >
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
