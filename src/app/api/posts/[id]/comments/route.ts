import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { content } = await request.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: Number(session?.user.id),
        postId: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }
    throw error;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const result = await prisma.comment.deleteMany({
    where: {
      id: Number(id),
      userId: Number(session?.user.id),
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Comment deleted successfully" },
    { status: 200 }
  );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(id),
    },
    include: {
      _count: {
        select: {
          likesComment: true,
          replies: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      likesComment: {
        where: {
          userId: Number(session?.user.id),
        },
      },
      replies: {
        where: {
          userId: Number(session?.user.id),
        },
      },
    },
  });

  const commentsWithExtras = comments.map((comment) => ({
    ...comment,
    isLiked: (comment.likesComment.length || 0) > 0,
    hasCommented: (comment.replies.length || 0) > 0,
  }));

  return NextResponse.json(commentsWithExtras);
}
