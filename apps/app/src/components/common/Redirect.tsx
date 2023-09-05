import { Redirect as ExpoRedirect } from 'expo-router';

export function Redirect({ href }: { href: string }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <ExpoRedirect href={href} />;
}
