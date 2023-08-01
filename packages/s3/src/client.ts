import { S3Client } from "@aws-sdk/client-s3";

import { raise } from "@innch/utils";

export const bucket =
  process.env.AWS_BUCKET ?? raise("No AWS_BUCKET environmental variable");
const region =
  process.env.AWS_REGION ?? raise("No AWS_REGION environmental variable");

export const client = new S3Client({
  region,
  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID ??
      raise("No AWS_ACCESS_KEY_ID environmental variable"),
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY ??
      raise("No AWS_SECRET_ACCESS_KEY environmental variable"),
  },
});
