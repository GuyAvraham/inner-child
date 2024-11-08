import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function JumpingDots({ className, style }: HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={clsx('inline-flex', className)}
      style={{
        transform: 'translateY(0.25rem) rotate(180deg)',
        ...style,
      }}
    >
      <span className="animate-[bounce_1s_infinite_0.66s]">.</span>
      <span className="animate-[bounce_1s_infinite_0.33s]">.</span>
      <span className="animate-bounce">.</span>
    </span>
  );
}
