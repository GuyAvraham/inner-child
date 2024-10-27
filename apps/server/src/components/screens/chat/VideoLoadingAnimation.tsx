import clsx from 'clsx';

export default function VideoLoadingAnimation({ isLoading }: { isLoading?: boolean }) {
  return (
    <div
      className={clsx(
        'absolute left-2 top-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] animate-[spin_3s_linear_infinite] rounded-full border-0 border-t-2 border-t-[#4285F4]',
        !isLoading && 'hidden',
      )}
    />
  );
}
