-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectCollaboration" DROP CONSTRAINT "ProjectCollaboration_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectCollaboration" DROP CONSTRAINT "ProjectCollaboration_userId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "pace" SET NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "privacyLevel",
DROP COLUMN "projectId";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectCollaboration";

-- DropEnum
DROP TYPE "PrivacyLevel";

-- DropEnum
DROP TYPE "AccessLevel";

