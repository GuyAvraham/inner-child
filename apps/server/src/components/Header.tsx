import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="absolute left-0 top-0 z-30 flex min-h-[64px] justify-end p-4">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}
