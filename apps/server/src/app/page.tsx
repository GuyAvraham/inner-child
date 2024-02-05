import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Chat from './chat/page';

export const runtime = 'edge';

export default function HomePage() {
  return (
    <>
      <header className="flex justify-end p-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </header>
      <main>
        <SignedIn>
          <Chat/>
        </SignedIn>
      </main>
    </>
  );
}
