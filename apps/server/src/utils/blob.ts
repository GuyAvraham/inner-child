export const blobToUri = async (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
};

// export const uriToBlob = (uri: string): Promise<Blob> => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       // return the blob
//       resolve(xhr.response as Blob);
//     };
//     xhr.onerror = function () {
//       reject(new Error('uriToBlob failed'));
//     };
//     xhr.responseType = 'blob';
//     xhr.open('GET', uri, true);

//     xhr.send(null);
//   });
// };

export const uriToBlob = (uri: string) => {
  const formData = new FormData();
  formData.append('uri', uri);
  return fetch('/api/getVideo', {
    method: 'POST',
    body: formData,
  }).then((res) => res.blob());
};
