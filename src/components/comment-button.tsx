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

export default function CommentButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>0</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg">Comments (2)</DialogTitle>
        </DialogHeader>

        <div className="border-b pb-4 mb-4">
          <form className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Post Comment
              </Button>
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
          <div className="group relative">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">John Doe</span>
                  <span className="text-xs text-muted-foreground">30m ago</span>
                </div>
                <p className="text-sm mt-1">This is a sample comment. The UI looks great!</p>
                <div className="flex items-center gap-4 mt-1">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="h-3.5 w-3.5" />
                    <span>5</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Reply className="h-3.5 w-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
