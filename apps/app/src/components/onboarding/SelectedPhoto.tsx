import { useAssets } from 'expo-asset';
import type { ImageProps } from 'expo-image';
import { Image } from 'expo-image';

export default function SelectedPhoto({
  source,
  className,
  ...props
}: ImageProps) {
  const [assets] = useAssets([require('~/assets/placeholder.png')]);

  return (
    <Image
      className={`h-64 w-64 self-center ${className}`}
      source={source ?? assets?.[0]?.localUri}
      {...props}
    />
  );
}
