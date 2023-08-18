import type { PressableProps, TextProps, View } from 'react-native';
import { Pressable, Text as RNText } from 'react-native';

function Button({
  children,
  className,
  ...props
}: PressableProps & React.RefAttributes<View>) {
  return (
    <Pressable
      className={`rounded-lg bg-black px-5 py-2.5 ${className}`}
      {...props}>
      {children}
    </Pressable>
  );
}

function Text({ children, className, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      className={`text-white ${className}`}>
      {children}
    </RNText>
  );
}

Button.Text = Text;

export default Button;
