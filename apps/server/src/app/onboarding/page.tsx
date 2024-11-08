import { SignedIn } from '@clerk/nextjs';

import Header from '~/components/Header';
import UploadForm from '~/components/screens/onboarding/UploadForm';

export default function Onboarding() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <SignedIn>
          <UploadForm />
        </SignedIn>
      </main>
    </>
  );
}
