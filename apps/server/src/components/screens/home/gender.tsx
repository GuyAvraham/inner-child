'use client';

import { useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

import { generateToken } from '~/utils/token';
import Button from '~/components/Button';
import Spinner from '~/components/Spinner';
import { useRouteState } from '~/hooks/useRouteState';

export default function GenderForm() {
  const { user } = useUser();
  const { openUpload } = useRouteState();

  const setUserGender = useCallback(
    (gender: 'male' | 'female') => async () => {
      if (!user) return;

      await user.update({ unsafeMetadata: { gender, token: generateToken() } });

      openUpload();
    },
    [openUpload, user],
  );

  return (
    <div className="flex flex-1 flex-col justify-evenly p-4">
      <p className="my-auto whitespace-pre-line text-center font-[Poppins-Bold] text-4xl leading-[48px] sm:my-0">
        We respect all gender identities.{'\n'}For our AI to generate an older image, please select{'\n'} ‘Male’ or
        ‘Female’—whichever best fits your older self.
      </p>

      {user ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-16">
          <Button className="w-full min-w-[140px] sm:w-auto" onClick={setUserGender('male')}>
            Male
          </Button>
          <Button className="w-full min-w-[140px] sm:w-auto" onClick={setUserGender('female')}>
            Female
          </Button>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
