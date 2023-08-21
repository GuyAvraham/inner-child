import type { TextProps } from 'react-native';
import { Text as RNText } from 'react-native';

export default function Text({ children, className, ...props }: TextProps) {
  return (
    <RNText
      className={`font-[Poppins] text-white ${className}`}
      {...props}>
      {children}
    </RNText>
  );
}
