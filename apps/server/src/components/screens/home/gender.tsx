'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { generateToken } from '~/utils/token';
import Button from '~/components/Button';

export default function GenderForm() {
  const { user } = useUser();
  const router = useRouter();

  const setUserGender = useCallback(
    async (gender: 'male' | 'female') => {
      if (!user) return;

      await user.update({ unsafeMetadata: { gender, token: generateToken() } });

      router.replace('/onboarding');
    },
    [router, user],
  );

  return (
    <div className="flex flex-1 flex-col justify-evenly p-4">
      <p className="my-auto text-center font-[Poppins-Bold] text-4xl leading-[48px] sm:my-0">
        Our image engine needs to understand if you are more of a {'\n'}male or female?
      </p>

      <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-16">
        <Button className="w-full min-w-[140px] sm:w-auto" onClick={() => setUserGender('male')}>
          Male
        </Button>
        <Button className="w-full min-w-[140px] sm:w-auto" onClick={() => setUserGender('female')}>
          Female
        </Button>
      </div>
    </div>
  );
}
