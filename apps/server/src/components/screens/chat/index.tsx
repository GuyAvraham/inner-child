'use client';

import type { FormEvent, KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { api } from '~/utils/api';
import { send } from '~/utils/d-id';
import Button from '~/components/Button';
import JumpingDots from '~/components/JumpingDots';
import useUserData from '~/hooks/useUserData';
import SendSVG from '~/svg/SendSVG';
import { Age, ConversationStatus, Role } from '~/types';
import ChatOptions from './ChatOptions';
import Message from './Message';
import { ScrollArea } from './ScrollArea';

const VideoStream = dynamic(() => import('./VideoStream'), { ssr: false });

const mockText = () =>
  new Promise<string>((resolve) => {
    const randNum = Math.floor(Math.random() * 100);
    resolve(`Hello, I am your future self. I am here to help you with your journey. ${randNum}`);
  });

export default function Chat() {
  const massageListRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user, data } = useUserData();
  const gender = data.gender as 'male' | 'female';
  const userName = user?.firstName ?? '';
  const splitter = '<user_name>';
  const utils = api.useContext();
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);
  const [conversationAge, setConversationAge] = useState(Age.Old);
  const [wasPlayedLastAiMessageAfterLoad, setWasPlayedLastAiMessageAfterLoad] = useState(false);
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
  const scrollListToEnd = useCallback(() => {
    setTimeout(() => {
      massageListRef.current?.scrollTo({ top: massageListRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!(message && message.trim().length > 0) || !messages || !prompts) return;
      localStorage.setItem('wasPlayed', '');

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
      const responseMessage =
        process.env.NEXT_PUBLIC_SERVER_MODE === 'development'
          ? await mockText()
          : await sendMessageToOpenAI(messagesForSending);
      await saveMessage({ age: conversationAge, message: message.trim(), sender: Role.User });
      if (responseMessage) {
        setLastGPTResponse(responseMessage);
        await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
        if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'development') {
          void send(responseMessage, gender, conversationAge);
        }
      }

      await utils.conversation.get.invalidate();
      setMessage('');
      setConversationStatus(ConversationStatus.Idle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationAge, gender, message, utils.conversation.get, saveMessage, sendMessageToOpenAI, messages, prompts],
  );

  useEffect(() => {
    void (async () => {
      setInitialMessage(null);
      if (!areMessagesLoading && messages?.length === 0 && prompts) {
        setIsWaitingInitialMessage(true);
        const responseMessage =
          process.env.NEXT_PUBLIC_SERVER_MODE === 'development'
            ? await mockText()
            : await sendMessageToOpenAI([
                { role: Role.System, content: prompts[conversationAge].split(splitter).join(userName) },
              ]);
        console.log(responseMessage);
        if (responseMessage) {
          setInitialMessage(responseMessage);
          await saveMessage({ age: conversationAge, message: responseMessage, sender: Role.Assistant });
          if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'development') {
            void send(responseMessage, gender, conversationAge);
          }
          await utils.conversation.get.invalidate();
          setIsWaitingInitialMessage(false);
        }
      }
    })();
  }, [areMessagesLoading, messages, gender, conversationAge, prompts]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const { visibleMessages, lastVisibleMessageId } = useMemo(() => {
    let lastId = '';
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
      lastId = 'newMessage';
      if (lastGPTResponse) {
        // fast showing last GRP response message
        list.push({
          id: 'lastGPTResponse',
          sender: Role.Assistant,
          text: lastGPTResponse,
          ...commonProps,
        });
        lastId = 'lastGPTResponse';
      } else {
        // showing typing message
        list.push({
          id: 'typing',
          sender: Role.Assistant,
          text: 'Typing',
          ...commonProps,
        });
        lastId = 'typing';
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
      lastId = 'initialMessage';
    }

    return { visibleMessages: list, lastVisibleMessageId: lastId };
  }, [messages, conversationStatus, initialMessage, lastGPTResponse]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!wasPlayedLastAiMessageAfterLoad && messages && messages?.length > 0) {
      const lastAiMessage = messages.findLast((message) => message.sender === Role.Assistant);
      setWasPlayedLastAiMessageAfterLoad(true);
      if (!lastAiMessage) return;

      if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'development') {
        void send(lastAiMessage.text, gender, conversationAge);
      }
    }
  }, [wasPlayedLastAiMessageAfterLoad, conversationAge, gender, messages]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && formRef.current) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  }, []);

  useEffect(scrollListToEnd, [visibleMessages.length, lastVisibleMessageId, scrollListToEnd]);

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center gap-6">
      <div className="relative flex min-h-[162px] w-full flex-col items-center sm:min-h-[226px]">
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
        <VideoStream key="video-stream" videoRef={videoRef} />
      </div>

      <ScrollArea containerRef={massageListRef} className="w-full">
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
      </ScrollArea>

      <form
        ref={formRef}
        className="flex min-h-[156px] w-full flex-col items-center gap-4 sm:min-h-[194px]"
        onSubmit={handleSendMessage}
      >
        <textarea
          className="w-full rounded-lg border border-white/20 bg-white/10 p-4 text-white outline-none sm:min-h-[120px]"
          placeholder="Say something..."
          value={!isStatusIdle ? '' : message}
          onChange={!isStatusIdle ? undefined : (e) => setMessage(e.target.value)}
          disabled={conversationStatus !== ConversationStatus.Idle}
          onKeyDown={handleKeyDown}
        />
        <div className="flex w-full items-center justify-between gap-4">
          <div className="hidden flex-col opacity-50 sm:flex">
            <span className="text-sm text-white">* Enter - to send</span>
            <span className="text-sm text-white">* Shift + Enter - new row</span>
          </div>
          <Button className="w-full gap-2 sm:w-fit" type="submit" disabled={isSendDisabled}>
            Send message
            <SendSVG height={20} width={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}
