'use client';

import { useEffect, useState } from 'react';
import type { Message } from 'ai/react';

import { cn } from '~/utils/cn';

interface MessageProps {
  text: string;
  isUserMessage: boolean;
  withAnimation?: boolean;
}

export default function Message({ text, isUserMessage, withAnimation }: MessageProps) {
  const [message, setMessage] = useState<string>(text);

  useEffect(() => {
    if (!withAnimation) return;

    const element = ' .';
    const lastStep = `${element}${element}${element}`;
    const interval = setInterval(() => {
      setMessage((message) => (message.endsWith(lastStep) ? text : message + element));
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'mb-4 flex w-fit max-w-[500px] overflow-y-auto rounded-xl p-3',
        isUserMessage && 'ml-auto bg-[#4285F4]',
        !isUserMessage && 'bg-[rgba(255,255,255,0.19)]',
      )}
    >
      {message}
    </div>
  );
}
