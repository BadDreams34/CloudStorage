/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
CREATE SEQUENCE file_id_seq;
ALTER TABLE "File" ALTER COLUMN "id" SET DEFAULT nextval('file_id_seq');
ALTER SEQUENCE file_id_seq OWNED BY "File"."id";

-- AlterTable
CREATE SEQUENCE folders_id_seq;
ALTER TABLE "Folders" ALTER COLUMN "id" SET DEFAULT nextval('folders_id_seq');
ALTER SEQUENCE folders_id_seq OWNED BY "Folders"."id";

-- AlterTable
CREATE SEQUENCE members_id_seq;
ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT nextval('members_id_seq');
ALTER SEQUENCE members_id_seq OWNED BY "members"."id";

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "session"("sid");
