import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

import Header from '~/components/Header';
import AccountChecker from '~/components/screens/home/AccountChecker';

export const runtime = 'nodejs';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <>
      <Header />
      <SignedOut>
        <div className="flex h-full items-center justify-center">
          <SignInButton mode="modal">
            <button
              className="focus:outline-hidden mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      <main className="flex flex-1 flex-col p-4">
        <SignedIn>
          <AccountChecker isGenderExist={!!user?.unsafeMetadata?.gender} />
        </SignedIn>
      </main>
    </>
  );
}
