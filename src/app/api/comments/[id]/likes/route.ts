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

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to like a comment" },
      { status: 401 }
    );
  }

  try {
    await prisma.likeComment.create({
      data: {
        userId: Number(session.user.id),
        commentId: Number(id),
      },
    });
    return NextResponse.json(
      { message: "Comment liked successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      } else if (error.code === "P2002") {
        return NextResponse.json(
          { error: "You have already liked this comment" },
          { status: 400 }
        );
      }
    }
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to unlike a comment" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.likeComment.deleteMany({
      where: {
        userId: Number(session.user.id),
        commentId: Number(id),
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Comment unliked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unliking comment:", error);
    return NextResponse.json(
      { error: "Failed to unlike comment" },
      { status: 500 }
    );
  }
}
