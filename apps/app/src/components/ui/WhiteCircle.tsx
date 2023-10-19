import type { ReactNode } from 'react';
import { View } from 'react-native';
import clsx from 'clsx';

interface WhiteCircleProps {
  children: ReactNode;
  className?: string;
}

export function WhiteCircle({ children, className }: WhiteCircleProps) {
  return (
    <View
      className={clsx(
        'relative h-[154] w-[154] items-center justify-center rounded-full border border-white/40 bg-white/20',
        className,
      )}
    >
      {children}
    </View>
  );
}
