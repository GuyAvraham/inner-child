'use client';

import { useEffect } from 'react';

import { api } from '~/utils/api';
import Spinner from '~/components/Spinner';
import { useRouteState } from '~/hooks/useRouteState';
import { Age } from '~/types';
import Chat from '../chat';
import GenerationForm from '../generateOld/GenerationFrom';
import UploadForm from '../onboarding/UploadForm';
import GenderForm from './gender';

export default function AccountChecker({ isGenderExist }: { isGenderExist?: boolean }) {
  const { state, openChat, openGender } = useRouteState();

  const { data: oldPhoto, isLoading: isOldLoading } = api.photo.getByAge.useQuery({
    age: Age.Old,
  });

  useEffect(() => {
    if (!isOldLoading && oldPhoto?.uri) {
      openChat();
    }
  }, [isOldLoading, oldPhoto?.uri, openChat]);

  useEffect(() => {
    if (!isGenderExist) {
      openGender();
    }
  }, []);

  if (isOldLoading) {
    return <Spinner />;
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
