import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  containerClassName?: string;
}

export default function Toggle({ label, title, className, containerClassName, ...rest }: ToggleProps) {
  return (
    <label className={clsx('inline-flex cursor-pointer items-center gap-2', containerClassName)} title={title}>
      <input type="checkbox" value="" className={clsx('peer sr-only', className)} {...rest} />
      <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300">{label}</span>
      <div className="peer relative h-6 w-11 min-w-[2.75rem] rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700" />
    </label>
  );
}
