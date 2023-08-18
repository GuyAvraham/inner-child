export const blobToUri = async (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
};

export const uriToBlob = async (uri: string) => {
  return await (await fetch(uri)).blob();
};
