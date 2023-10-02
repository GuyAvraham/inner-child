import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { prompts } from '~/utils/prompts';
import { AnimatedProgress } from '~/components/AnimatedProgress';
import { ConversationAgeSelect } from '~/components/ConversationAgeSelect';
import { Message } from '~/components/ui/Message';
import Text from '~/components/ui/Text';
import { useKeyboardVisible } from '~/hooks/useKeyboardVisible';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import { CloseSVG } from '~/svg/close';
import { OptionsSVG } from '~/svg/options';
import { RefreshChatSVG } from '~/svg/refreshChat';
import { SendMessageSVG } from '~/svg/sendMessage';
import { Age, ConversationStatus, Role } from '~/types';

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const utils = api.useContext();
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);
  const [conversationAge, setConversationAge] = useState(Age.Young);
  const [isWaitingInitialMessage, setIsWaitingInitialMessage] = useState(false);
  const [message, setMessage] = useState<string>('');
  const { data: messages, isLoading: areMessagesLoading } = api.conversation.get.useQuery({
    age: conversationAge,
  });
  const { mutateAsync: saveMessage, isLoading: isGettingText } = api.conversation.saveMessage.useMutation();
  const { mutateAsync: sendMessageToOpenAI } = api.conversation.sendMessageToOpenAI.useMutation({
    onError(error) {
      console.error(error);
      setConversationStatus(ConversationStatus.Idle);
    },
  });
  const { mutateAsync: clearConversation, isLoading: isClearingConversation } = api.conversation.clear.useMutation();
  const [isOpenedOptions, setIsOpenedOptions] = useState(false);
  const { triggerVideoGeneration } = useVideoResponse(conversationAge);
  const keyboardVisible = useKeyboardVisible();
  const scrollListToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!(message && message.trim().length > 0) || !messages) return;

    setConversationStatus(ConversationStatus.Waiting);

    const messagesForSending = messages.map((message) => ({
      role: message.sender as Role,
      content: message.text,
    }));
    messagesForSending.unshift({ role: Role.System, content: prompts[conversationAge] });
    messagesForSending.push({ role: Role.User, content: message.trim() });
    const responseMessage = await sendMessageToOpenAI(messagesForSending);
    await saveMessage({ age: conversationAge, message: message.trim(), sender: Role.User });
    if (responseMessage) {
      await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
      void triggerVideoGeneration(responseMessage);
    }

    await utils.conversation.get.invalidate();
    setMessage('');
    setConversationStatus(ConversationStatus.Idle);
  }, [
    conversationAge,
    message,
    triggerVideoGeneration,
    utils.conversation.get,
    saveMessage,
    sendMessageToOpenAI,
    messages,
  ]);

  useEffect(() => {
    void (async () => {
      if (!areMessagesLoading && messages?.length === 0) {
        setIsWaitingInitialMessage(true);
        const responseMessage = await sendMessageToOpenAI([{ role: Role.System, content: prompts[conversationAge] }]);
        console.log(responseMessage);
        if (responseMessage) {
          await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
          await utils.conversation.get.invalidate();
          setIsWaitingInitialMessage(false);
        }
      }
    })();
  }, [areMessagesLoading, messages, conversationAge]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearConversation = useCallback(async () => {
    if (!messages?.[0]) {
      setIsOpenedOptions(false);
      return;
    }

    await clearConversation({ id: messages[0].conversationId });
    await utils.conversation.invalidate();
    setIsOpenedOptions(false);
  }, [clearConversation, messages, utils.conversation]);

  const isSendDisabled =
    conversationStatus === ConversationStatus.Waiting || isGettingText || message.trim().length === 0;
  const visibleMessages = useMemo(() => {
    const list = messages?.slice() ?? [];
    if (conversationStatus === ConversationStatus.Waiting && message) {
      list.push({
        id: 'newMessage',
        sender: Role.User,
        text: message,
        conversationId: 'string1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      list.push({
        id: 'typing',
        sender: Role.Assistant,
        text: 'Typing',
        conversationId: 'string1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return list;
  }, [messages, conversationStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(scrollListToEnd, [messages, scrollListToEnd]);

  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding">
      <View className="relative mb-8 mt-10 items-center">
        <Text className="font-[Poppins-Bold] text-lg">
          {conversationAge === Age.Young ? 'Young you' : 'Future you'}
        </Text>
        <TouchableOpacity className="absolute right-3" onPress={() => setIsOpenedOptions(true)}>
          <OptionsSVG />
        </TouchableOpacity>
      </View>
      <View className="mb-5">
        <ConversationAgeSelect
          age={conversationAge}
          setAge={setConversationAge}
          disabled={conversationStatus === ConversationStatus.Waiting || isGettingText}
        />
      </View>
      <FlatList
        ref={flatListRef}
        onContentSizeChange={scrollListToEnd}
        onLayout={scrollListToEnd}
        className="mb-4 flex-1 px-4"
        data={visibleMessages}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        keyExtractor={(message) => message.id as string}
        renderItem={({ item: { id, text, sender } }) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <Message key={id} text={text} isUserMessage={sender === Role.User} withAnimation={id === 'typing'} />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            {isWaitingInitialMessage ? (
              <AnimatedProgress fast />
            ) : (
              <Text className="font-[Poppins-Bold] text-base text-white/40">
                {areMessagesLoading ? 'Loading previous messages...' : 'No messages yet...'}
              </Text>
            )}
          </View>
        }
      />
      <View
        className={clsx(
          'm-4 mt-0 flex-row items-center rounded-lg border-[1px] border-white/20 bg-white/10',
          keyboardVisible && 'mb-20',
        )}
      >
        <TextInput
          editable={conversationStatus === ConversationStatus.Idle}
          focusable={conversationStatus === ConversationStatus.Idle}
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
    </KeyboardAvoidingView>
  );
}
