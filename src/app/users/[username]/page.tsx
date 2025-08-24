import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import PostCard from "@/components/post-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPosts } from "@/repositories/post-repo";
import { Session } from "next-auth";

interface UserProfileProps {
  params: {
    username: string;
  };
}

export default async function UserProfile({ params }: UserProfileProps) {
  const session = await getServerSession(authOptions);
  const { username } = await params;

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  // Fetch user's posts

  const posts = await getPosts(session as Session, user.id);

  // const isCurrentUser = Number(session?.user?.id) === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src={user.avatarUrl || ""}
              alt={user.name || user.username}
            />
            <AvatarFallback>
              {user.name
                ? user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-center">{user.bio}</p>}
          </div>

          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <div className="font-bold">{user._count.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
          </div>

          {/* {isCurrentUser ? (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/settings/profile">Edit Profile</Link>
            </Button>
          ) : (
            <Button className="mt-4">Follow</Button>
          )} */}
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Posts</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet</p>
            {/* {isCurrentUser && (
              <Button asChild variant="link" className="mt-2">
                <Link href="/posts/new">Create your first post</Link>
              </Button>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
