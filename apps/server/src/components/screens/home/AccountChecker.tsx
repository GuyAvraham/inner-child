'use client';

import { useEffect } from 'react';

import { api } from '~/utils/api';
import { useRouteState } from '~/hooks/useRouteState';
import { Age } from '~/types';
import Chat from '../chat';
import GenerationForm from '../generateOld/GenerationFrom';
import UploadForm from '../onboarding/UploadForm';
import GenderForm from './gender';

export default function AccountChecker({ isGenderExist }: { isGenderExist?: boolean }) {
  const { state, openChat } = useRouteState();

  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });

  useEffect(() => {
    if (!isOldLoading && oldPhoto?.uri) {
      openChat();
    }
  }, [isOldLoading, oldPhoto?.uri, openChat]);

  if (!isGenderExist) {
    return <GenderForm />;
  }

  if (isOldLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-transparent border-t-white" />
      </div>
    );
  }

  return (
    <>
      {state === 'gender' && <GenderForm />}
      {state === 'upload' && <UploadForm />}
      {state === 'generateOld' && <GenerationForm />}
      {state === 'chat' && <Chat />}
    </>
  );
}
