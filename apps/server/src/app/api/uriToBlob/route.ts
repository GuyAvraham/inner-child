import { NextResponse } from 'next/server';

// TODO FIX: for Vercel it needs to be 'edge' but for local development we need 'nodejs'
// there is not solution yet, so if you're developing locally use 'nodejs'
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const uri = formData.get('uri') as string;
    const contentType = formData.get('contentType') as string;
    if (uri) {
      // const blob = await uriToBlob(body.url);
      const res = await fetch(uri);
      const blob = await res.blob();

      const headers = new Headers();
      headers.set('Content-Type', contentType);

      return new NextResponse(blob, { status: 200, statusText: 'OK', headers });
    }

    return NextResponse.json({ status: 'fail', error: 'No URL' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e });
  }
}
