import { authOptions } from "@/lib/auth";
import { minioClient, PRIVATE_BUCKET } from "@/lib/minio";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentTypeMapping = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-matroska": "mkv",
    "video/x-msvideo": "avi",
  };

  if (!contentType) {
    return NextResponse.json(
      { error: "Content type is required as a query parameter (content-type)" },
      { status: 400 }
    );
  }

  const fileExtension =
    contentTypeMapping[contentType as keyof typeof contentTypeMapping];

  if (!contentType) {
    return NextResponse.json(
      { error: "Content type is required" },
      { status: 400 }
    );
  }

  if (!fileExtension) {
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 400 }
    );
  }

  const policy = minioClient.newPostPolicy();
  policy.setBucket(PRIVATE_BUCKET);
  policy.setContentType(contentType);
  policy.setKey(`posts-media/${uuidv7()}.${fileExtension}`);
  policy.setContentLengthRange(0, 10 * 1024 * 1024); // 10MB
  policy.setExpires(new Date(Date.now() + 60 * 1000)); // 1 minute

  const presignedUrl = await minioClient.presignedPostPolicy(policy);

  return NextResponse.json(presignedUrl);
}
