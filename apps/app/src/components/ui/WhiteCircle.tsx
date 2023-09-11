import type { ReactNode } from 'react';
import { View } from 'react-native';

export function WhiteCircle({ children }: { children: ReactNode }) {
  return (
    <View className="h-[154] w-[154] items-center justify-center rounded-full border border-white/40 bg-white/20">
      {children}
    </View>
  );
}
