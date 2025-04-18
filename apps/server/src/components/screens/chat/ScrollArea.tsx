import { useEffect, useRef } from 'react';
import type { HTMLAttributes, RefObject } from 'react';
import clsx from 'clsx';

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  containerRef: RefObject<HTMLDivElement>;
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
    <div ref={containerRef} className={clsx('flex-1 overflow-auto overscroll-contain', className)} {...rest}>
      <div ref={subContainerRef} style={{ maxHeight: '100px' }}>
        {children}
      </div>
    </div>
  );
};
