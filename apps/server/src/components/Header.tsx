import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="flex justify-end p-4">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}
