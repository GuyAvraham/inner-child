import Replicate from 'replicate';

import { raise } from '~/utils';

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN ?? raise('No REPLICATE_API_TOKEN env var'),
});
