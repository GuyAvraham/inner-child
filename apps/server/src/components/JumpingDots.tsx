import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function JumpingDots({ className, style }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('inline-flex', className)}
      style={{
        transform: 'translateY(0.25rem) rotate(180deg)',
        ...style,
      }}
    >
      <div className="animate-[bounce_1s_infinite_0.66s]">.</div>
      <div className="animate-[bounce_1s_infinite_0.33s]">.</div>
      <div className="animate-bounce">.</div>
    </div>
  );
}
