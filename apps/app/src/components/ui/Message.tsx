import { View } from 'react-native';

import Text from './Text';

interface MessageProps {
  text: string;
  isUserMessage: boolean;
}

export function Message({ text, isUserMessage }: MessageProps) {
  return (
    <View
      className="mb-4 max-w-[300px] rounded-xl p-3"
      style={{
        alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isUserMessage ? '#4285F4' : 'rgba(255, 255, 255, 0.19)',
      }}
    >
      <Text>{text}</Text>
    </View>
  );
}
