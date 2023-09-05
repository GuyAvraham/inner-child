import type { PressableProps, TextProps } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import Text from './Text';

const styles = StyleSheet.create({
  button: {},
  text: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
});

type ButtonProps = PressableProps & {
  wide?: boolean;
  variant?: 'small';
  fill?: boolean;
  transparent?: boolean;
};

function Button({ children, wide, disabled, variant, fill, transparent, ...props }: ButtonProps) {
  const buttonBackgrounds = {
    normal: transparent ? 'transparent' : '#ffffff1a',
    pressed: '#ffffff33',
    disabled: '#ffffff09',
  } as const;

  return (
    <Pressable
      style={({ pressed }) => ({
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: pressed ? '#ffffff80' : transparent ? '#ffffffff' : '#ffffff33',
        borderRadius: variant === 'small' ? 6 : 10,
        paddingHorizontal: variant === 'small' ? 20 : 40,
        paddingVertical: variant === 'small' ? 10 : 15,
        backgroundColor: buttonBackgrounds[pressed ? 'pressed' : disabled ? 'disabled' : 'normal'],
        width: wide ? '100%' : undefined,
        flex: fill ? 1 : undefined,
        opacity: disabled ? 0.5 : 1,
      })}
      disabled={disabled}
      {...props}>
      {children}
    </Pressable>
  );
}

function T({ children, icon, ...props }: TextProps & { icon?: string }) {
  return (
    <Text
      {...props}
      style={styles.text}>
      {icon ? icon : null}
      {children}
    </Text>
  );
}

Button.Text = T;

export default Button;
