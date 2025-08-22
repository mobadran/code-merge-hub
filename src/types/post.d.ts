import { Post, User } from "@prisma/client";

type PostWithExtras = Post & {
  author: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  _count: {
    likes: number;
  };
  isLiked: boolean;
};
