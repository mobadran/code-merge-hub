import { PrismaClient, Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    password: "$2b$10$8Tw0l.Wq9WjFqfXQ7DHxp.AjadCrShdR7ClLf5KUqNF3SdkymcJNO",
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    password: "$2b$10$8Tw0l.Wq9WjFqfXQ7DHxp.AjadCrShdR7ClLf5KUqNF3SdkymcJNO",
  },
];
// Password is: "password"

export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email }, // Search by unique field
      update: {
        name: u.name,
        password: u.password,
      },
      create: u,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
