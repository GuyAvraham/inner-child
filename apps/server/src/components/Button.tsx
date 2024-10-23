import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  wide?: boolean;
  variant?: 'small';
  fill?: boolean;
  transparent?: boolean;
  blue?: boolean;
}

export default function Button({
  wide,
  variant,
  fill,
  className,
  children,
  blue,
  transparent,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center border active:border-[#ffffff80] active:bg-[#ffffff33]',
        blue
          ? 'border-[rgba(255, 255, 255, 0.2)] bg-[rgba(66, 133, 244, 0.92)]'
          : transparent
            ? 'border-[#ffffffff] bg-transparent'
            : 'border-[#ffffff33] bg-[#ffffff1a]',
        variant === 'small' && 'rounded-md px-5 py-2.5',
        variant !== 'small' && 'rounded-[10px] px-10 py-4',
        wide && 'w-full',
        fill && 'flex-1',
        disabled && 'bg-[#ffffff09] opacity-50',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
