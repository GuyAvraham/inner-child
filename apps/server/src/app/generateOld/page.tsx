import { SignedIn } from '@clerk/nextjs';

import Header from '~/components/Header';
import GenerationForm from '~/components/screens/generateOld/GenerationFrom';

export default function GenerateOld() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <SignedIn>
          <GenerationForm />
        </SignedIn>
      </main>
    </>
  );
}
