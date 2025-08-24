import { Session } from "next-auth";
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/types/post";

export const getPosts = async (session: Session): Promise<PostWithExtras[]> => {
  const postData = await prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
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
      comments: {
        where: { userId: Number(session.user.id) },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const posts = postData.map((post) => ({
    ...post,
    isLiked: (post.likes.length || 0) > 0,
    hasCommented: (post.comments.length || 0) > 0,
  }));

  return posts;
};

export const getPost = async (
  postId: number,
  session: Session
): Promise<PostWithExtras> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      _count: {
        select: {
          comments: true,
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
      comments: {
        where: { userId: Number(session.user.id) },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return {
    ...post,
    isLiked: (post.likes?.length || 0) > 0,
    hasCommented: (post.comments?.length || 0) > 0,
  };
};
