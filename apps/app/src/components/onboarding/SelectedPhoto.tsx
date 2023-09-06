import { View } from 'react-native';
import type { ImageProps } from 'expo-image';
import { Image } from 'expo-image';

import { UploadSVG } from '~/svg/upload';
import { WhiteCircle1SVG } from '~/svg/whiteCircle1';
import { WhiteCircle2SVG } from '~/svg/whiteCircle2';

interface SelectedPhotoProps extends ImageProps {
  wrapped?: boolean;
}

export default function SelectedPhoto({ source, className, wrapped, ...props }: SelectedPhotoProps) {
  let content = <UploadSVG />;
  if (source) {
    content = <Image className={`h-28 w-28 self-center ${className}`} source={source} {...props} />;
  }

  if (wrapped) {
    return (
      <View className="relative h-[256] w-[256] items-center justify-center self-center rounded-full bg-white/10">
        <WhiteCircle1SVG />
        <WhiteCircle2SVG />
        {content}
      </View>
    );
  }

  return content;
}
