'use client';

import { api } from '~/utils/api';

export default function Secret() {
  const [message] = api.auth.getSecretMessage.useSuspenseQuery();

  return <div>{message}</div>;
}
