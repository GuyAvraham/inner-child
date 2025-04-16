import type { Age } from '~/types';
import { DID_API_KEY, DID_API_URL } from '~/utils';

// voice gallery: https://speech.microsoft.com/portal/voicegallery
const voices = {
  male: {
    young: 'en-US-AnaNeural',
    old: 'en-US-DavisNeural',
  },
  female: {
    young: 'en-US-AnaNeural',
    old: 'en-US-CoraNeural',
  },
};

export const POST = async (request: Request) => {
  const { input, sessionId, streamId, gender, age } = (await request.json()) as {
    input: string;
    sessionId: string;
    streamId: string;
    gender: 'male' | 'female';
    age: Age;
  };

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
        provider: { type: 'microsoft', voice_id: voices[gender][age] },
        ssml: false,
      },
      config: { fluent: 'false', pad_audio: '0.0' },
    }),
  });
};
