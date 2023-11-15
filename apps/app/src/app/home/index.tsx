import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

import { api } from '~/utils/api';
import { ChatOptions } from '~/components/home/ChatOptions';
import { ConversationAgeSelect } from '~/components/home/ConversationAgeSelect';
import { AnimatedProgress } from '~/components/ui/AnimatedProgress';
import { Message } from '~/components/ui/Message';
import Text from '~/components/ui/Text';
import { isIos } from '~/config/variables';
import { useKeyboardVisible } from '~/hooks/useKeyboardVisible';
import useUserData from '~/hooks/useUserData';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import { SendMessageSVG } from '~/svg/sendMessage';
import { Age, ConversationStatus, Role } from '~/types';

export default function HomeScreen() {
  const flatListRef = useRef<FlatList>(null);
  const { user } = useUserData();
  const userName = user?.firstName ?? '';
  const splitter = '<user_name>';
  const utils = api.useContext();
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);
  const [conversationAge, setConversationAge] = useState(Age.Young);
  const [isWaitingInitialMessage, setIsWaitingInitialMessage] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [lastGPTResponse, setLastGPTResponse] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const { mutateAsync: deleteVideo, isLoading: isDeletingVideo } = api.video.deleteByAge.useMutation();
  const { data: messages, isLoading: areMessagesLoading } = api.conversation.get.useQuery({
    age: conversationAge,
  });
  const { mutateAsync: saveMessage, isLoading: isGettingText } = api.conversation.saveMessage.useMutation();
  const { data: prompts } = api.conversation.getPrompts.useQuery();
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
    if (!(message && message.trim().length > 0) || !messages || !prompts) return;

    setConversationStatus(ConversationStatus.Waiting);
    const messagesForSending = messages.map((message) => ({
      role: message.sender as Role,
      content: message.text,
    }));
    messagesForSending.unshift({ role: Role.System, content: prompts[conversationAge].split(splitter).join(userName) });
    messagesForSending.push({ role: Role.User, content: message.trim() });
    const responseMessage = await sendMessageToOpenAI(messagesForSending);
    await saveMessage({ age: conversationAge, message: message.trim(), sender: Role.User });
    if (responseMessage) {
      setLastGPTResponse(responseMessage);
      await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
      void triggerVideoGeneration(responseMessage);
    }

    await utils.conversation.get.invalidate();
    setMessage('');
    setConversationStatus(ConversationStatus.Idle);
  }, [conversationAge, message, utils.conversation.get, saveMessage, sendMessageToOpenAI, messages, prompts]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void (async () => {
      setInitialMessage(null);
      if (!areMessagesLoading && messages?.length === 0 && prompts) {
        setIsWaitingInitialMessage(true);
        const responseMessage = await sendMessageToOpenAI([
          { role: Role.System, content: prompts[conversationAge].split(splitter).join(userName) },
        ]);
        console.log(responseMessage);
        if (responseMessage) {
          setInitialMessage(responseMessage);
          await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
          void triggerVideoGeneration(responseMessage);
          await utils.conversation.get.invalidate();
          setIsWaitingInitialMessage(false);
        }
      }
    })();
  }, [areMessagesLoading, messages, conversationAge, prompts, triggerVideoGeneration]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearConversation = useCallback(async () => {
    if (!messages?.[0]) {
      setIsOpenedOptions(false);
      return;
    }

    await deleteVideo({ age: conversationAge });
    void utils.video.getByAge.invalidate();
    await clearConversation({ id: messages[0].conversationId });
    void utils.conversation.invalidate();
    setIsOpenedOptions(false);
  }, [clearConversation, messages, utils.conversation, conversationAge]); // eslint-disable-line react-hooks/exhaustive-deps

  const isStatusIdle = conversationStatus === ConversationStatus.Idle;
  const isSendDisabled = !isStatusIdle || isGettingText || message.trim().length === 0;
  const visibleMessages = useMemo(() => {
    const list = messages?.slice() ?? [];

    const commonProps = {
      conversationId: 'conversationId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // optimistic UI messages
    if (conversationStatus === ConversationStatus.Waiting && message) {
      // fast showing user message
      list.push({
        id: 'newMessage',
        sender: Role.User,
        text: message,
        ...commonProps,
      });
      if (lastGPTResponse) {
        // fast showing last GRP response message
        list.push({
          id: 'lastGPTResponse',
          sender: Role.Assistant,
          text: lastGPTResponse,
          ...commonProps,
        });
      } else {
        // showing typing message
        list.push({
          id: 'typing',
          sender: Role.Assistant,
          text: 'Typing',
          ...commonProps,
        });
      }
    } else {
      // clear if we loaded all messages from server
      setLastGPTResponse(null);
    }
    if (initialMessage && list.length === 0) {
      // fast showing initial message
      list.push({
        id: 'initialMessage',
        sender: Role.Assistant,
        text: initialMessage,
        ...commonProps,
      });
    }

    return list;
  }, [messages, conversationStatus, initialMessage, lastGPTResponse]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(scrollListToEnd, [messages, scrollListToEnd]);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={isIos ? 'padding' : 'height'}>
      <View className="relative mb-8 mt-10 items-center">
        <Text className="font-[Poppins-Bold] text-lg">
          {conversationAge === Age.Young ? 'Young you' : 'Future you'}
        </Text>
        <ChatOptions
          isOpen={isOpenedOptions}
          open={() => setIsOpenedOptions(true)}
          close={() => setIsOpenedOptions(false)}
          isClearingConversation={isDeletingVideo || isClearingConversation}
          handleClearConversation={handleClearConversation}
        />
      </View>
      <View className="mb-5">
        <ConversationAgeSelect
          age={conversationAge}
          setAge={setConversationAge}
          disabled={!isStatusIdle || isGettingText}
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
          <View className={clsx('items-center', !keyboardVisible && 'mt-20', keyboardVisible && 'mt-2')}>
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
          keyboardVisible && isIos && 'mb-20',
        )}
      >
        <TextInput
          editable={isStatusIdle}
          focusable={isStatusIdle}
          className="flex-1 p-4 text-white"
          value={!isStatusIdle ? '' : message}
          onChangeText={!isStatusIdle ? undefined : setMessage}
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
    </KeyboardAvoidingView>
  );
}
