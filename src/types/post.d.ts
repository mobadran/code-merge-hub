import { Post } from "@prisma/client";

type PostWithAuthor = Post & {
  author: {
    name: string | null;
    username: string;
    avatarUrl: string | null;
  };
};
