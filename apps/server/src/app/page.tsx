import { currentUser, SignedIn } from '@clerk/nextjs';

import Header from '~/components/Header';
import AccountChecker from '~/components/screens/home/AccountChecker';

export const runtime = 'edge';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <SignedIn>
          <AccountChecker isGenderExist={!!user?.unsafeMetadata?.gender} />
        </SignedIn>
      </main>
    </>
  );
}
