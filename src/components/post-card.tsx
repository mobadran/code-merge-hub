import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PostWithAuthor } from "@/types/post";
import Link from "next/link";
import { Button } from "./ui/button";
import { MessageSquare, ThumbsUp, ArrowRight } from "lucide-react";
import NO_PFP from "@/../public/no-pfp.jpeg";
import Time from "./time";

export default function PostCard({ post }: { post: PostWithAuthor }) {
  // Show read more if content is longer than 200 characters
  const showReadMore = post.content.length > 200;
  const displayContent = showReadMore
    ? `${post.content.substring(0, 200)}...`
    : post.content;

  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-sm border-0 p-0 gap-0">
      {/* Author info */}
      <CardHeader className="flex items-center space-x-3 p-4 pb-0">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={post.author.avatarUrl || NO_PFP}
            alt={post.author.name || "Author"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{post.author.name}</p>
          <Time
            timestamp={post.createdAt.toISOString()}
            type="relative"
            className="text-xs text-muted-foreground"
          />
        </div>
      </CardHeader>

      {/* Post content */}
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2">
          {post.title}
        </CardTitle>
        <div>
          <p className="text-foreground">{displayContent}</p>
          {showReadMore && (
            <div className="mt-2">
              <Link
                href={`/posts/${post.id}`}
                className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 w-fit"
              >
                Read more
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>

      {/* Media */}
      {post.mediaUrls?.[0] && (
        <div className="relative w-full aspect-video">
          <Image
            src={post.mediaUrls[0]}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Action buttons */}
      <CardFooter className="flex justify-between p-2 border-t-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">132 likes</p>
          <p className="text-xs text-muted-foreground">12 comments</p>
        </div>
      </CardFooter>
    </Card>
  );
}
