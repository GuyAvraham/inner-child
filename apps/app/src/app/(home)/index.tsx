import { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

import { api } from '~/utils/api';
import { ConversationAgeSelect } from '~/components/ConversationAgeSelect';
import Text from '~/components/ui/Text';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import { CloseSVG } from '~/svg/close';
import { OptionsSVG } from '~/svg/options';
import { RefreshChatSVG } from '~/svg/refreshChat';
import { SendMessageSVG } from '~/svg/sendMessage';
import { Age } from '~/types';

export default function HomeScreen() {
  const utils = api.useContext();
  const [conversationStatus, setConversationStatus] = useState<'idle' | 'waiting'>('idle');
  const [conversationAge, setConversationAge] = useState(Age.Young);
  const [message, setMessage] = useState<string>('');
  const { data: messages, isLoading: areMessagesLoading } = api.conversation.get.useQuery({
    age: conversationAge,
  });
  const { mutateAsync: getText, isLoading: isGettingText } = api.conversation.text.useMutation();
  const { mutateAsync: clearConversation, isLoading: isClearingConversation } = api.conversation.clear.useMutation();
  const [isOpenedOptions, setIsOpenedOptions] = useState(false);
  const { triggerVideoGeneration } = useVideoResponse(conversationAge);

  const handleSendMessage = useCallback(async () => {
    if (!(message && message.trim().length > 0)) return;

    setConversationStatus('waiting');
    const { text } = await getText({ age: conversationAge, message });
    void utils.conversation.get.invalidate();
    setMessage('');

    await triggerVideoGeneration(text);

    setConversationStatus('idle');
  }, [conversationAge, getText, message, triggerVideoGeneration, utils.conversation.get]);

  const handleClearConversation = useCallback(async () => {
    if (!messages?.[0]) {
      setIsOpenedOptions(false);
      return;
    }

    await clearConversation({ id: messages[0].conversationId });
    await utils.conversation.invalidate();
    setIsOpenedOptions(false);
  }, [clearConversation, messages, utils.conversation]);

  const isSendDisabled = conversationStatus === 'waiting' || isGettingText || message.trim().length === 0;
  const visibleMessages = useMemo(() => {
    const list = messages?.slice() ?? [];
    if (conversationStatus === 'waiting' && message) {
      list.push({
        id: 'newMessage',
        sender: 'user',
        text: message,
        conversationId: 'string1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      list.push({
        id: 'typing',
        sender: 'assistant',
        text: 'Typing...',
        conversationId: 'string1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return list;
  }, [messages, conversationStatus, message]);

  return (
    <>
      <View className="relative mb-8 mt-10 items-center">
        <Text className="font-[Poppins-Bold] text-lg">
          {conversationAge === Age.Young ? 'Young you' : 'Future you'}
        </Text>
        <TouchableOpacity className="absolute right-3" onPress={() => setIsOpenedOptions(true)}>
          <OptionsSVG />
        </TouchableOpacity>
      </View>
      <View className="mb-5">
        <ConversationAgeSelect age={conversationAge} setAge={setConversationAge} />
      </View>
      <FlatList
        className="mb-4 flex-1 px-4"
        data={visibleMessages}
        keyExtractor={(message) => message.id}
        renderItem={({ item: message }) => {
          return (
            <View
              key={message.id}
              style={{
                padding: 12,
                borderRadius: 20,
                maxWidth: 300,
                marginBottom: 16,
                alignSelf: message.sender === 'assistant' ? 'flex-start' : 'flex-end',
                backgroundColor: message.sender === 'user' ? '#4285F4' : 'rgba(255, 255, 255, 0.19)',
              }}
            >
              <Text>{message.text}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Text className="font-[Poppins-Bold] text-base text-white/40">
              {areMessagesLoading ? 'Loading previous messages...' : 'No messages yet...'}
            </Text>
          </View>
        }
      />
      <View className="m-4 mt-0 flex-row items-center rounded-lg border-[1px] border-white/20 bg-red-500 bg-white/10">
        <TextInput
          editable={conversationStatus === 'idle'}
          focusable={conversationStatus === 'idle'}
          className="flex-1 p-4 text-white"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          className={`mr-2 ${isSendDisabled ? 'opacity-50' : ''}`}
          disabled={isSendDisabled}
          onPress={handleSendMessage}
        >
          <SendMessageSVG />
        </TouchableOpacity>
      </View>

      {isOpenedOptions && (
        <View
          className="absolute bg-black/80"
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
          }}
        >
          <View className="z-40 flex-row justify-end p-6">
            <TouchableOpacity onPress={() => setIsOpenedOptions(false)}>
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
              {isClearingConversation ? 'Clearing chat...' : 'Reset chat'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
