"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

export function LikeButton({
  postId,
  isLiked,
  initialLikeCount,
  isComment,
}: {
  postId: number;
  isLiked: boolean;
  initialLikeCount: number;
  isComment?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [stateIsLiked, setStateIsLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const toggleLike = async () => {
    setLoading(true);
    const nextLiked = !stateIsLiked;

    // optimistic update
    setStateIsLiked(nextLiked);
    setLikeCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      const response = await fetch(
        isComment
          ? `/api/comments/${postId}/likes`
          : `/api/posts/${postId}/likes`,
        {
          method: nextLiked ? "POST" : "DELETE",
        }
      );

      if (!response.ok) {
        // rollback
        setStateIsLiked(!nextLiked);
        setLikeCount((prev) => prev + (nextLiked ? -1 : 1));

        console.error("Failed to toggle like:", await response.json());
      }
    } catch (error) {
      // rollback on network error
      setStateIsLiked(!nextLiked);
      setLikeCount((prev) => prev + (nextLiked ? -1 : 1));

      console.error("Network error while toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isComment) {
    return (
      <button
        disabled={loading}
        aria-pressed={stateIsLiked}
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleLike}
      >
        <Heart className="h-3.5 w-3.5" fill={stateIsLiked ? "red" : "none"} />
        <span>{likeCount}</span>
      </button>
    );
  }
  return (
    <Button
      disabled={loading}
      variant="ghost"
      size="sm"
      aria-pressed={stateIsLiked}
      className="flex items-center gap-2"
      onClick={toggleLike}
    >
      <Heart className="h-4 w-4" fill={stateIsLiked ? "red" : "none"} />
      <span>{likeCount}</span>
    </Button>
  );
}
