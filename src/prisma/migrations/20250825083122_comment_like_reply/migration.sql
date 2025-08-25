/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_postId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Like" ADD COLUMN     "commentId" INTEGER,
ALTER COLUMN "postId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Like_commentId_idx" ON "public"."Like"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_commentId_key" ON "public"."Like"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
