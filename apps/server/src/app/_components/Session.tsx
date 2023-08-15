'use client';

import { api } from '~/utils/api';

export default function Session() {
  const [session] = api.auth.getSession.useSuspenseQuery();

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
