"use client";

import { Button } from "./ui/button";
import { MessageSquare, Heart, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { CommentWithExtras } from "@/types/post";

export default function CommentButton({
  postId,
  hasCommented,
  initialCommentCount,
}: {
  postId: number;
  hasCommented: boolean;
  initialCommentCount: number;
}) {
  const [comments, setComments] = useState<CommentWithExtras[]>([]);
  const [loading, setLoading] = useState(false);
  const [postButtonLoading, setPostButtonLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPostButtonLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create comment");
      }
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setComment("");
    } catch (err) {
      console.error("Failed to create comment", err);
    } finally {
      setPostButtonLoading(false);
    }
  };

  // This function fetches comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      console.log(data);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch only when dialog opens
  useEffect(() => {
    if (isOpen && comments.length === 0) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageSquare
            className="h-4 w-4"
            fill={hasCommented ? "currentColor" : "none"}
          />
          <span>{initialCommentCount}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Comments ({initialCommentCount})
          </DialogTitle>
        </DialogHeader>

        <div className="border-b pb-4 mb-4">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[100px] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={postButtonLoading}>
                Post Comment
              </Button>
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="group relative">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={comment.user.avatarUrl || ""} />
                    <AvatarFallback>
                      {comment.user.name?.[0] || comment.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Heart className="h-3.5 w-3.5" />
                        <span>0</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Reply className="h-3.5 w-3.5" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
