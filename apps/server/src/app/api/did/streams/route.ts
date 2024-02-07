import { DID_API_KEY, DID_API_URL } from '@innch/utils';

export const POST = async (request: Request) => {
  const { source_url } = (await request.json()) as { source_url: string };

  return await fetch(`${DID_API_URL}/talks/streams`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url,
    }),
  });
};
