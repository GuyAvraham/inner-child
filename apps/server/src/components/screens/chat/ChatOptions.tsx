'use client';

import { useCallback, useRef } from 'react';
import clsx from 'clsx';

import Button from '~/components/Button';
import { useOnClickOutside } from '~/hooks/useOnClickOutside';
import CloseSVG from '~/svg/CloseSVG';
import OptionsSVG from '~/svg/OptionsSVG';
import RefreshChatSVG from '~/svg/RefreshChatSVG';

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

  const handler = useCallback(() => close(), [close]);

  useOnClickOutside(modalRef, handler);

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
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap p-4 font-[Poppins-Bold]"
          disabled={isClearingConversation}
          onClick={handleClearConversation}
        >
          <RefreshChatSVG />
          {isClearingConversation ? 'Resetting chat...' : 'Reset chat'}
        </Button>
      </div>
    </div>
  );
}
