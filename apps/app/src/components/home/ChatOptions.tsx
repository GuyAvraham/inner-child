import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Portal } from '@gorhom/portal';
import clsx from 'clsx';

import { isIos } from '~/config/variables';
import { CloseSVG } from '~/svg/close';
import { OptionsSVG } from '~/svg/options';
import { RefreshChatSVG } from '~/svg/refreshChat';
import Text from '../ui/Text';

interface ChatOptionsProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isClearingConversation: boolean;
  handleClearConversation: () => void;
}

export function ChatOptions({
  isOpen,
  open,
  close,
  isClearingConversation,
  handleClearConversation,
}: ChatOptionsProps) {
  return (
    <>
      <TouchableOpacity className="absolute right-3" onPress={open}>
        <OptionsSVG />
      </TouchableOpacity>
      {isOpen ? (
        <Portal>
          <SafeAreaView
            className={clsx(`absolute bottom-0 left-0 right-0 top-0 flex bg-black/80 px-4`, !isIos && 'mt-2')}
          >
            <View className="z-40 flex-row justify-end p-6 pr-4 pt-12">
              <TouchableOpacity onPress={close}>
                <CloseSVG />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="w-full flex-row items-center justify-center p-4"
              disabled={isClearingConversation}
              onPress={handleClearConversation}
            >
              <RefreshChatSVG />
              <View className="w-2" />
              <Text className="font-[Poppins-Bold] text-lg">
                {isClearingConversation ? 'Resetting chat...' : 'Reset chat'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Portal>
      ) : null}
    </>
  );
}
