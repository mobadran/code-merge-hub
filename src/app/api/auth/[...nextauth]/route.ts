import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

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
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
