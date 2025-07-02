/*
  Warnings:

  - You are about to drop the column `FolderId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Folders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foldername` to the `Folders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderpath` to the `Folders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_FolderId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "FolderId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Folders" DROP COLUMN "name",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "foldername" TEXT NOT NULL,
ADD COLUMN     "folderpath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_username_key" ON "members"("username");
