import { DID_API_KEY, DID_API_URL } from '@innch/utils';

export const POST = async (request: Request) => {
  const { answer, sessionId, streamId } = (await request.json()) as {
    answer: RTCSessionDescriptionInit;
    sessionId: string;
    streamId: string;
  };

  return await fetch(`${DID_API_URL}/talks/streams/${streamId}/sdp`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answer,
      sessionId,
    }),
  });
};
