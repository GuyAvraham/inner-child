export const raise = (message: string) => {
  throw new Error(message);
};

export const DID_API_URL = 'https://api.d-id.com';
export const DID_API_KEY = process.env.DID_API_KEY;
