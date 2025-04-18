import { DID_API_KEY, DID_API_URL } from '@innch/utils';

import { getVoiceId } from '~/utils/voices';
import type { Age } from '~/types';

export const POST = async (request: Request) => {
  const { input, sessionId, streamId, gender, age } = (await request.json()) as {
    input: string;
    sessionId: string;
    streamId: string;
    gender: 'male' | 'female';
    age: Age;
  };

  const voiceId = getVoiceId(input, gender, age);

  return await fetch(`${DID_API_URL}/talks/streams/${streamId}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      script: {
        type: 'text',
        input,
        subtitles: 'false',
        provider: { type: 'microsoft', voice_id: voiceId },
        ssml: false,
      },
      config: { fluent: 'false', pad_audio: '0.0' },
    }),
  });
};
