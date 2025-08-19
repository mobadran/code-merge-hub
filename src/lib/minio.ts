import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!, 10),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const PUBLIC_BUCKET = process.env.MINIO_PUBLIC_BUCKET!;
export const PRIVATE_BUCKET = process.env.MINIO_PRIVATE_BUCKET!;
