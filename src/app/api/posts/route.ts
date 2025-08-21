import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  mediaUrls: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    try {
      const newPost = await prisma.post.create({
        data: {
          title: validation.data.title,
          content: validation.data.content,
          mediaUrls: validation.data.mediaUrls,
          author: {
            connect: { id: user.id },
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          mediaUrls: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return NextResponse.json(
        {
          message: "Post created successfully",
          data: newPost,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error creating post:", dbError);
      return NextResponse.json(
        {
          error: "Failed to create post",
          ...(process.env.NODE_ENV === "development" && { details: dbError }),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in POST /api/posts:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        ...(process.env.NODE_ENV === "development" && { details: error }),
      },
      { status: 500 }
    );
  }
}
