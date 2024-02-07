import { DID_API_KEY, DID_API_URL } from '@innch/utils';

export const POST = async (request: Request) => {
  const { candidate, sdpMid, sdpMLineIndex, sessionId, streamId } = (await request.json()) as {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    sessionId: string;
    streamId: string;
  };

  return await fetch(`${DID_API_URL}/talks/streams/${streamId}/ice`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      candidate,
      sdpMid,
      sdpMLineIndex,
      sessionId,
    }),
  });
};
