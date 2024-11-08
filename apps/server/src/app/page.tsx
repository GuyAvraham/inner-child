import { SignedIn } from '@clerk/nextjs';

import Header from '~/components/Header';
import GenderForm from '~/components/screens/home/gender';

export const runtime = 'edge';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <SignedIn>
          <GenderForm />
        </SignedIn>
      </main>
    </>
  );
}
