import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { bucket, client } from "./client";

export const createPresignedUrl = (key: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const getPresignedUrl = (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const uploadFile = (
  key: string,
  file: string | Blob | Uint8Array | Buffer,
) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });

  return client.send(command);
};

export const downloadFile = (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return client.send(command);
};
