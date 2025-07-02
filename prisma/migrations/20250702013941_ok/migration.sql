/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "session" RENAME CONSTRAINT "Session_pkey" TO "session_pkey";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "Folders";

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" SERIAL NOT NULL,
    "foldername" TEXT NOT NULL,
    "folderpath" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- RenameIndex
ALTER INDEX "Session_sid_key" RENAME TO "session_sid_key";
