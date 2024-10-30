import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useOnClickOutside = (
  ref: RefObject<HTMLDivElement>,
  handler: (event: unknown) => void,
  additionalRef?: RefObject<HTMLElement>,
) => {
  useEffect(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          ref.current.contains(event.target) ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          (additionalRef && (!additionalRef.current || additionalRef.current.contains(event.target)))
        ) {
          return;
        }
        handler(event);
      };

      const windowBlurred = (e: FocusEvent) => {
        const el = document.activeElement as HTMLIFrameElement;
        if (el.tagName.toLowerCase() === 'iframe') {
          handler(e);
        }
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      window.addEventListener('blur', windowBlurred);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
        window.removeEventListener('blur', windowBlurred);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler, additionalRef],
  );
};
