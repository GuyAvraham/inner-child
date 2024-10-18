'use client';

import { useEffect, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

export default function AnimatedProgress({ duration }: { duration?: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const timerId = setInterval(
      () => {
        setVal((prev) => {
          const res = prev + 10;
          if (res === 100) {
            clearInterval(timerId);
            return res - 1;
          }
          return res;
        });
      },
      duration ? duration * 1000 : 3000,
    );

    return () => {
      clearInterval(timerId);
    };
  }, [duration]);

  return (
    <CircularProgressbar
      value={val}
      text={`${val}%`}
      styles={buildStyles({
        pathTransitionDuration: 2,
      })}
    />
  );
}
