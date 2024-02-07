'use client';

import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';

import { api } from '~/utils/api';
import { init, send } from '~/utils/d-id';
import { Age, ConversationStatus, Role } from '~/types';

export default function Chat() {
  const [conversationAge] = useState(Age.Young);
  const [conversationStatus, setConversationStatus] = useState(ConversationStatus.Idle);

  const { mutateAsync: saveMessage } = api.conversation.saveMessage.useMutation();
  const { data: initialMessages } = api.conversation.get.useQuery({
    age: conversationAge,
  });

  const [didReady, setDidReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/gpt/send',
    id: 'guy-av',
    onFinish(message) {
      void send(message.content);
      // FIXME: we can just send chunk of text to the D-ID server because it may and probably will result in junk video and artifacts
      void saveMessage({ age: conversationAge, message: message.content, sender: Role.Assistant });
      setConversationStatus(ConversationStatus.Idle);
    },
    onError(error) {
      console.error(error);
      setConversationStatus(ConversationStatus.Idle);
    },
    initialMessages: initialMessages?.map((m) => ({ id: m.id, role: m.sender, content: m.text })) ?? [],
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConversationStatus(ConversationStatus.Waiting);
    void saveMessage({ age: conversationAge, message: input, sender: Role.User });
    handleSubmit(event);
  };

  useEffect(() => {
    if (videoRef.current)
      init('https://d-id-public-bucket.s3.amazonaws.com/or-roman.jpg', videoRef.current)
        .then(() => {
          setDidReady(true);
        })
        .catch((error) => {
          console.error('init', error);
          setDidReady(false);
        });
  }, [videoRef.current]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width={400} height={400}></video>

      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={onSubmit}>
        <label>
          Say something...
          <input
            className="border"
            value={input}
            onChange={handleInputChange}
            disabled={conversationStatus !== ConversationStatus.Idle || !didReady}
          />
        </label>
      </form>
    </div>
  );
}
