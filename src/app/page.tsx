import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  console.log(users);
  return (
    <>
      <h1>Hello World</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}
