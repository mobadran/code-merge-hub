import { Session } from "next-auth";
import prisma from "@/lib/prisma";

export const getPosts = async (session: Session) => {
  const postData = await prisma.post.findMany({
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      likes: {
        where: { userId: Number(session.user.id) },
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const posts = postData.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
  }));

  return posts;
};
