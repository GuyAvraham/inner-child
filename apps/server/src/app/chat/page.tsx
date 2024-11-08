import { SignedIn } from '@clerk/nextjs';

import Header from '~/components/Header';
import Chat from '~/components/screens/chat';

export default function ChatPage() {
  return (
    <>
      <Header isChatPage />
      <main className="flex flex-1 flex-col p-4">
        <SignedIn>
          <Chat />
        </SignedIn>
      </main>
    </>
  );
}
