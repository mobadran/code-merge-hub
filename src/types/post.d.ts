import { Comment, Post, User } from "@prisma/client";

type PostWithExtras = Post & {
  author: Pick<User, "id" | "username"> & {
    name: string | null;
    avatarUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  hasCommented: boolean;
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    user: {
      id: number;
      name: string | null;
      username: string;
      avatarUrl: string | null;
    };
  }[];
};

type CommentWithExtras = Comment & {
  user: Pick<User, "id" | "username"> & {
    name: string | null;
    avatarUrl: string | null;
  };
};
