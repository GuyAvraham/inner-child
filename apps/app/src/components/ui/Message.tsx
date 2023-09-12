import { useEffect, useState } from 'react';
import { View } from 'react-native';

import Text from './Text';

interface MessageProps {
  text: string;
  isUserMessage: boolean;
  withAnimation?: boolean;
}

export function Message({ text, isUserMessage, withAnimation }: MessageProps) {
  const [message, setMessage] = useState<string>(text);

  useEffect(() => {
    if (!withAnimation) return;

    const element = ' .';
    const lastStep = `${element}${element}${element}`;
    const interval = setInterval(() => {
      setMessage((message) => (message.endsWith(lastStep) ? text : message + element));
    }, 500);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View
      className="mb-4 max-w-[300px] rounded-xl p-3"
      style={{
        alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isUserMessage ? '#4285F4' : 'rgba(255, 255, 255, 0.19)',
      }}
    >
      <Text>{message}</Text>
    </View>
  );
}
