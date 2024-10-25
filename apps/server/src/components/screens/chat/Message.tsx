'use client';

import { useEffect, useState } from 'react';
import type { Message } from 'ai/react';
import clsx from 'clsx';

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
      className={clsx(
        'mb-4 flex max-w-[500px] overflow-y-auto rounded-xl p-3',
        isUserMessage && 'self-end bg-[#4285F4]',
        !isUserMessage && 'self-start bg-[rgba(255,255,255,0.19)]',
      )}
    >
      {message}
    </div>
  );
}
