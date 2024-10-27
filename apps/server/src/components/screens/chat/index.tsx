'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { api } from '~/utils/api';
import Button from '~/components/Button';
import JumpingDots from '~/components/JumpingDots';
import useUserData from '~/hooks/useUserData';
import { useVideoResponse } from '~/hooks/useVideoResponse';
import SendSVG from '~/svg/SendSVG';
import { Age, ConversationStatus, Role } from '~/types';
import ChatOptions from './ChatOptions';
import Message from './Message';
import Video from './Video';

export default function Chat() {
  const massageListRef = useRef<HTMLDivElement>(null);
  const massageListContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserData();
  const userName = user?.firstName ?? '';
  const splitter = '<user_name>';
  const utils = api.useContext();
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);
  const [conversationAge, setConversationAge] = useState(Age.Old);
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
  const scrollListToEnd = useCallback(() => {
    setTimeout(() => {
      massageListRef.current?.scrollTo({ top: massageListRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!(message && message.trim().length > 0) || !messages || !prompts) return;

      setConversationStatus(ConversationStatus.Waiting);
      const messagesForSending = messages.map((message) => ({
        role: message.sender as Role,
        content: message.text,
      }));
      messagesForSending.unshift({
        role: Role.System,
        content: prompts[conversationAge].split(splitter).join(userName),
      });
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationAge, message, utils.conversation.get, saveMessage, sendMessageToOpenAI, messages, prompts],
  );

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

  useEffect(() => {
    if (!isGettingText && massageListContainerRef.current) {
      const h = massageListContainerRef.current.offsetHeight;
      massageListContainerRef.current.style.maxHeight = `${h}px`;
    }
  }, [isGettingText]);

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center gap-10">
      <div className="relative flex w-full flex-col items-center">
        <h2 className="mb-1 font-[Poppins-Bold] text-lg">
          {conversationAge === Age.Young ? 'Young you' : 'Future you'}
        </h2>
        <ChatOptions
          isOpen={isOpenedOptions}
          open={() => setIsOpenedOptions(true)}
          close={() => setIsOpenedOptions(false)}
          isClearingConversation={isDeletingVideo || isClearingConversation}
          handleClearConversation={handleClearConversation}
        />
        <Video age={conversationAge} setAge={setConversationAge} disabled={!isStatusIdle || isGettingText} />
      </div>

      <div ref={massageListContainerRef} className="flex w-full flex-1 flex-col overflow-hidden py-4">
        <div ref={massageListRef} className="w-full overflow-y-auto">
          {visibleMessages.length > 0 ? (
            visibleMessages.map((m, index) => (
              <Message
                key={m.id + index}
                text={m.text}
                isUserMessage={m.sender === Role.User}
                withAnimation={m.id === 'typing'}
              />
            ))
          ) : (
            <div className="self-center">
              {isWaitingInitialMessage ? (
                <JumpingDots />
              ) : (
                <p className="font-[Poppins-Bold] text-base text-white/40">
                  {areMessagesLoading ? 'Loading previous messages...' : 'No messages yet...'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <form className="flex w-full flex-col items-center gap-4" onSubmit={handleSendMessage}>
        <textarea
          className="w-full rounded-lg border border-white/20 bg-white/10 p-4 text-white outline-none sm:min-h-[120px]"
          placeholder="Say something..."
          value={!isStatusIdle ? '' : message}
          onChange={!isStatusIdle ? undefined : (e) => setMessage(e.target.value)}
          disabled={conversationStatus !== ConversationStatus.Idle}
        />
        <Button className="w-full gap-2 sm:w-fit" type="submit" disabled={isSendDisabled}>
          Send message
          <SendSVG height={20} width={20} />
        </Button>
      </form>
    </div>
  );
}
