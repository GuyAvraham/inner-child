import { useAnimationValue } from '~/hooks/useAnimationValue';
import { ProgressCircle } from './ui/ProgressCircle';

export function AnimatedProgress({ fast, duration }: { fast?: boolean; duration?: number }) {
  const value = useAnimationValue(fast, duration);

  return <ProgressCircle value={value} />;
}
