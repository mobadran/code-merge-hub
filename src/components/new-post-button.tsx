"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewPostButton() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMediaUrl = () => {
    if (!currentMediaUrl) return;
    
    try {
      // Basic URL validation
      new URL(currentMediaUrl);
      setMediaUrls([...mediaUrls, currentMediaUrl]);
      setCurrentMediaUrl("");
      if (errors.mediaUrls) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { mediaUrls: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    } catch {
      setErrors({ ...errors, mediaUrls: "Please enter a valid URL" });
    }
  };

  const handleRemoveMediaUrl = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mediaUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to create post. Please try again."
        );
      }

      // Reset form and close dialog
      setTitle("");
      setContent("");
      setMediaUrls([]);
      setErrors({});
      
      // Refresh the page to show the new post
      router.refresh();
      setOpen(false);
      
      toast.success("Your post has been created.");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your post"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className={`w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.content ? "border-red-500" : ""
              }`}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Media URLs (optional)</Label>
            <div className="flex space-x-2">
              <Input
                type="url"
                value={currentMediaUrl}
                onChange={(e) => setCurrentMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMediaUrl}
                disabled={!currentMediaUrl}
              >
                Add
              </Button>
            </div>
            {errors.mediaUrls && (
              <p className="text-sm text-red-500">{errors.mediaUrls}</p>
            )}
            
            {mediaUrls.length > 0 && (
              <div className="mt-2 space-y-1">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="text-sm truncate max-w-[400px]">{url}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMediaUrl(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
