import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
          user?.password ||
            "$2b$10$CwTycUXWue0Thq9StjUM0uJ8S8Wjz6xH4YQq6Ff8UeW8zJb0OC6bW"
        );

        if (user && isPasswordValid) {
          return {
            ...user,
            id: user.id.toString(),
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id; // add user ID
        token.avatarUrl = user.avatarUrl; // add avatar URL if you want
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id; // read from token
        session.user.image = token.avatarUrl; // map to session.user.image
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
