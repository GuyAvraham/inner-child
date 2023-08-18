export const generateToken = () =>
  (Math.random() + 1).toString(36).substring(7);
