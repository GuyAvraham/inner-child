export async function uploadFileToS3(url: string, blob: Blob) {
  return await fetch(url, {
    method: "PUT",
    body: blob,
  });
}
