import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { PostWithAuthor } from "@/types/post";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Card className="w-full max-w-md overflow-hidden rounded-2xl shadow-sm pt-0">
      {/* Cover image */}
      {post.mediaUrls?.[0] && (
        <div className="relative w-full h-48">
          <Image
            src={post.mediaUrls[0]}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Text content */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {post.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-2">
          {post.author.avatarUrl && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name || "Author"}
                fill
                className="object-cover"
              />
            </div>
          )}
          {post.author.name}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/posts/${post.id}`}
            className="group flex items-center gap-1"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
