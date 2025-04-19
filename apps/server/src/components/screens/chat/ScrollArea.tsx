'use client';

import { useEffect, useRef } from 'react';
import type { HTMLAttributes, RefObject } from 'react';

import { cn } from '~/utils/cn';

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  containerRef: RefObject<HTMLDivElement | null>;
}

export const ScrollArea = ({ containerRef, className, children, ...rest }: ScrollAreaProps) => {
  const subContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && subContainerRef.current) {
      const h = containerRef.current.clientHeight;
      containerRef.current.style.maxHeight = `${h}px`;
      subContainerRef.current.style.maxHeight = 'none';
    }
  }, [containerRef]);

  return (
    <div ref={containerRef} className={cn('flex-1 overflow-auto overscroll-contain', className)} {...rest}>
      <div ref={subContainerRef} style={{ maxHeight: '100px' }}>
        {children}
      </div>
    </div>
  );
};
