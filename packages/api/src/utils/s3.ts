import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.AWS_BUCKET ?? "innch-storage";
const region = process.env.AWS_REGION ?? "eu-central-1";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const createPresignedUrl = (key: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const getUrlForDb = (key: string) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(s3Client, command);
};

const s3 = {
  createPresignedUrl,
  getUrlForDb,
};

export default s3;