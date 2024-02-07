import { DID_API_KEY, DID_API_URL } from '@innch/utils';

export const POST = async (request: Request) => {
  const { input, sessionId, streamId } = (await request.json()) as {
    input: string;
    sessionId: string;
    streamId: string;
  };

  return await fetch(`${DID_API_URL}/talks/streams/${streamId}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        input,
        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
        ssml: 'false',
      },
      config: { fluent: true, pad_audio: 1, stitch: true },
      audio_optimization: '2',
      session_id: sessionId,
    }),
  });
};
