import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

import { s3 } from '~/server/api/s3';
import { db } from '~/server/db';
import type { Age } from '~/types';
import { DID_API_KEY, DID_API_URL, raise } from '~/utils';

export const POST = async (request: Request) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = user;
  const { age } = (await request.json()) as { age: Age };
  const photo = await db.photo.findFirst({
    where: { age, userId: id },
  });

  const source_url = await s3.getPresignedUrl(`${id}/${photo?.key ?? raise('No photo found')}`);

  const res = await fetch(`${DID_API_URL}/talks/streams`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url,
    }),
  });

  const json = await res.json();

  return NextResponse.json(json);
};
