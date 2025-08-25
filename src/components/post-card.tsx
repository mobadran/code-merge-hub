import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PostWithExtras } from "@/types/post";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Time from "./time";
import PostAttachments from "./post-attachments";
import { LikeButton } from "./like-button";
import CommentButton from "./comment-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function PostCard({ post }: { post: PostWithExtras }) {
  // Show read more if content is longer than 200 characters
  const showReadMore = post.content.length > 200;
  const displayContent = showReadMore
    ? `${post.content.substring(0, 200)}...`
    : post.content;

  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-sm border-0 p-0 gap-0">
      {/* Author info */}
      <CardHeader className="flex items-center space-x-3 p-4 pb-0">
        <Link
          href={`/users/${post.author.username}`}
          className="relative h-10 w-10 rounded-full overflow-hidden"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatarUrl || ""} />
            <AvatarFallback>
              {post.author.name?.[0] || post.author.username[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/users/${post.author.username}`}>
            <p className="font-medium">{post.author.name}</p>
          </Link>
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
      <div className="post-attachments">
        {post.mediaUrls.slice(0, 4).map((url, index) => (
          <PostAttachments post={post} startingImageIndex={index} key={index}>
            <div className="relative w-full aspect-video">
              <Image
                src={url}
                alt={post.title}
                className="object-cover h-auto w-full"
                width={800}
                height={450}
              />
              {index === 3 && post.mediaUrls.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">
                    +{post.mediaUrls.length - 3} more
                  </div>
                </div>
              )}
            </div>
          </PostAttachments>
        ))}
      </div>

      <CardFooter className="flex justify-between p-2 border-t-1">
        <div className="flex items-center gap-2">
          <LikeButton
            postId={post.id}
            isLiked={post.isLiked}
            initialLikeCount={post._count.likes}
          />
          <CommentButton
            postId={post.id}
            hasCommented={post.hasCommented}
            initialCommentCount={post._count.comments}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
