import PostCard from "@/components/post-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPosts } from "../repositories/post-repo";

export default async function App() {
  const session = await getServerSession(authOptions);

  const posts = await getPosts(session!);

  return (
    <main className="p-4">
      {posts.length > 0 ? (
        <ul className="mt-4 flex flex-col items-center gap-4">
          {posts.map((post) => (
            <li key={post.id} className="w-160">
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
