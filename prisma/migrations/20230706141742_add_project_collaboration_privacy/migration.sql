-- CreateEnum
CREATE TYPE "PrivacyLevel" AS ENUM ('PRIVATE', 'PROJECT', 'PUBLIC');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('READ', 'WRITE', 'COMMENT');

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "pace" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatarUrl" TEXT,
    "ownerId" TEXT NOT NULL,
    "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCollaboration" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'READ',

    CONSTRAINT "ProjectCollaboration_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCollaboration" ADD CONSTRAINT "ProjectCollaboration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCollaboration" ADD CONSTRAINT "ProjectCollaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
