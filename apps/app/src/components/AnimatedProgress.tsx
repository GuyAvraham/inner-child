import { useAnimationValue } from '~/hooks/useAnimationValue';
import { ProgressCircle } from './ui/ProgressCircle';

export function AnimatedProgress({ fast }: { fast?: boolean }) {
  const value = useAnimationValue(fast);

  return <ProgressCircle value={value} />;
}
