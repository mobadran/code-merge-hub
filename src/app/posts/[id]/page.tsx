import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import NO_PFP from "@/../public/no-pfp.jpeg";
import Time from "@/components/time";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  // If id is not a number, throw a 404 error
  const postId = Number(id) || notFound();

  const post = await prisma.post.findUnique({
    where: { id: postId },
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

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
        </Button>
      </div>

      <article className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {/* Post Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="relative w-full h-96">
            <Image
              src={post.mediaUrls[0]}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6">
          {/* Post Header */}
          <header className="mb-6 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatarUrl || NO_PFP}
                    alt={post.author.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {post.author.name || `@${post.author.username}`}
                  </p>
                  <Time timestamp={post.createdAt.toISOString()} />
                </div>
              </div>
            </div>
            {/* Likes & Comments */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <p className="text-xs text-muted-foreground">132 likes</p>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                <p className="text-xs text-muted-foreground">12 comments</p>
              </Button>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-line">{post.content}</div>
          </div>

          {/* Additional Media */}
          {post.mediaUrls && post.mediaUrls.length > 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.mediaUrls.slice(1).map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Media ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
