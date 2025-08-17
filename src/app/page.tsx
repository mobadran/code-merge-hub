import prisma from "@/lib/prisma";
import NewPostButton from "@/components/new-post-button";
import PostCard from "@/components/post-card";

export default async function App() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
  return (
    <main className="p-4">
      <div className="flex justify-between items-center">
        <h2>Posts</h2>
        <NewPostButton />
      </div>
      {posts.length > 0 ? (
        <ul className="mt-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}
