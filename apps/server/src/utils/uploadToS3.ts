export async function uploadToS3(url: string, blob: Blob) {
  return await fetch(url, {
    method: 'PUT',
    body: blob,
  });
}
