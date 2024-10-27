'use client';

import clsx from 'clsx';

import Button from '~/components/Button';
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
  return (
    <div className="absolute right-3 z-10">
      <button className="border-0 bg-transparent outline-none" onClick={isOpen ? close : open}>
        {isOpen ? <CloseSVG /> : <OptionsSVG />}
      </button>
      <div
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
