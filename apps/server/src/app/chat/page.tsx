'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useChat } from 'ai/react';

import { api } from '~/utils/api';
import { Age, ConversationStatus, Role } from '~/types';

export default function Chat() {
  const [conversationAge, setConversationAge] = useState(Age.Young);
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);

  const { mutateAsync: saveMessage, isLoading: isGettingText } = api.conversation.saveMessage.useMutation();
  const { data: initialMessages, isLoading: areMessagesLoading } = api.conversation.get.useQuery({
    age: conversationAge,
  });

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/gpt/send',
    id: 'guy-av',
    onFinish(message) {
      void saveMessage({ age: conversationAge, message: message.content, sender: Role.Assistant });
      setConversationStatus(ConversationStatus.Idle);
    },
    onError(error) {
      console.error(error);
      setConversationStatus(ConversationStatus.Idle);
    },
    initialMessages: initialMessages?.map((m) => ({ id: m.id, role: m.sender, content: m.text })) ?? [],
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConversationStatus(ConversationStatus.Waiting);
    void saveMessage({ age: conversationAge, message: input, sender: Role.User });
    handleSubmit(event);
  };

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={onSubmit}>
        <label>
          Say something...
          <input className='border' value={input} onChange={handleInputChange} disabled={conversationStatus !== ConversationStatus.Idle} />
        </label>
      </form>
    </div>
  );
}
