import { NextResponse } from 'next/server';

import { uploadToS3 } from '~/utils/uploadToS3';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File;
    const url = formData.get('url') as string;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    await uploadToS3(url, new Blob([buffer]));

    return NextResponse.json({ status: 'success' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e });
  }
}
