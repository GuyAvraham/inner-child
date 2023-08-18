import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { raise } from '@innch/utils';

export const bucket =
  process.env.AWS_BUCKET ?? raise('No AWS_BUCKET environmental variable');
export const region =
  process.env.AWS_REGION ?? raise('No AWS_REGION environmental variable');

export const client = new S3Client({
  region,
  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID ??
      raise('No AWS_ACCESS_KEY_ID environmental variable'),
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY ??
      raise('No AWS_SECRET_ACCESS_KEY environmental variable'),
  },
});

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

export const deleteFile = (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return client.send(command);
};

export const deleteFiles = (keys: string[]) => {
  const command = new DeleteObjectsCommand({
    Bucket: bucket,
    Delete: { Objects: keys.map((key) => ({ Key: key })) },
  });

  return client.send(command);
};

export const s3 = {
  createPresignedUrl,
  getPresignedUrl,
  uploadFile,
  downloadFile,
  deleteFile,
  deleteFiles,
};
