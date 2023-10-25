import { memo } from 'react';

import { useAnimationValue } from '~/hooks/useAnimationValue';
import { ProgressCircle } from './ui/ProgressCircle';

interface AnimatedProgressProps {
  fast?: boolean;
  duration?: number;
}

export const AnimatedProgress = memo(function AnimatedProgress({ fast, duration }: AnimatedProgressProps) {
  const value = useAnimationValue(fast, duration);

  return <ProgressCircle value={value} />;
});
