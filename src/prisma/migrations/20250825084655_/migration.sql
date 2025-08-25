/*
  Warnings:

  - You are about to drop the column `commentId` on the `Like` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_commentId_fkey";

-- DropIndex
DROP INDEX "public"."Like_commentId_idx";

-- DropIndex
DROP INDEX "public"."Like_userId_commentId_key";

-- AlterTable
ALTER TABLE "public"."Like" DROP COLUMN "commentId";

-- CreateTable
CREATE TABLE "public"."LikeComment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikeComment_userId_commentId_key" ON "public"."LikeComment"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."LikeComment" ADD CONSTRAINT "LikeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LikeComment" ADD CONSTRAINT "LikeComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
