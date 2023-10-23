import { defaultPrompts } from './prompts';

const space = process.env.CONTENTFUL_SPACE_ID ?? '';
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN ?? '';

export const contentful = {
  getPrompts: async () => {
    const response = await fetch(`https://cdn.contentful.com/spaces/${space}/entries`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const fields = json?.items[0]?.fields as typeof defaultPrompts | undefined;

    if (!fields) return defaultPrompts;

    return fields;
  },
};
