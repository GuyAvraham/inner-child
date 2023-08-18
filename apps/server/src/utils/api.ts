import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@innch/api';

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from '@innch/api';
