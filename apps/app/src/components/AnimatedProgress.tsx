import { useAnimationValue } from '~/hooks/useAnimationValue';
import { ProgressCircle } from './ui/ProgressCircle';

export function AnimatedProgress() {
  const value = useAnimationValue();

  return <ProgressCircle value={value} />;
}
