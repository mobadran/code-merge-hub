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
  const { id } = params;

  try {
    await prisma.like.create({
      data: {
        userId: Number(session?.user.id),
        postId: Number(id),
      },
    });
    return NextResponse.json(
      { message: "Like created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      } else if (error.code === "P2002") {
        return NextResponse.json(
          { error: "You have already liked this post" },
          { status: 400 }
        );
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
  const { id } = params;

  const result = await prisma.like.deleteMany({
    where: {
      userId: Number(session?.user.id),
      postId: Number(id),
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Like not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Like deleted successfully" },
    { status: 200 }
  );
}
