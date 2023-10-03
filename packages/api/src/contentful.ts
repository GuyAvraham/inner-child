import { createClient } from 'contentful';

import { defaultPrompts } from './prompts';

const space = process.env.CONTENTFUL_SPACE_ID ?? '';
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN ?? '';

const client = createClient({ space, accessToken });

export const contentful = {
  getPrompts: async () => {
    const entries = await client.getEntries({ locale: 'en-US' }).catch(console.error);
    const fields = entries?.items[0]?.fields as typeof defaultPrompts | undefined;

    if (!fields) return defaultPrompts;

    return fields;
  },
};
