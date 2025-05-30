// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { Configuration, OpenAIApi } from 'openai-edge';

import { NextResponse } from 'next/server';

// console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);

// // Create an OpenAI API client (that's edge friendly!)
// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(_req: Request) {
  // // Extract the `messages` from the body of the request
  // const { messages } = await req.json();
  // // Ask OpenAI for a streaming chat completion given the prompt
  // const response = await openai.createChatCompletion({
  //   model: 'gpt-4-1106-preview',
  //   stream: true,
  //   messages,
  // });
  // // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // // Respond with the stream
  // return new StreamingTextResponse(stream);

  return NextResponse.json({});
}
