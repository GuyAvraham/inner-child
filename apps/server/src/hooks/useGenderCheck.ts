import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { generateToken } from '~/utils/token';

export default function useGenderCheck(isBaseUrl?: boolean) {
  const { user } = useUser();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!user) return;

    if (user?.unsafeMetadata?.gender) {
      localStorage.setItem('gender', user.unsafeMetadata.gender as 'male' | 'female');
      return;
    }

    const localGender = localStorage.getItem('gender');
    if (localGender && (localGender === 'male' || localGender === 'female')) {
      void (async () => {
        await user.update({ unsafeMetadata: { gender: localGender, token: generateToken() } });
        if (isBaseUrl) {
          router.replace('/onboarding');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
