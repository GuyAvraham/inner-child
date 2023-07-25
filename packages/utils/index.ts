export { transformer } from "./src/transformer";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const raise = (error: string): never => {
  throw new Error(error);
};

export const blobToDataURL = async (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
};
