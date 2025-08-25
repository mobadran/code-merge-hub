import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      image?: string | null;
      username?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    avatarUrl?: string | null;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatarUrl?: string | null;
    username?: string | null;
  }
}
