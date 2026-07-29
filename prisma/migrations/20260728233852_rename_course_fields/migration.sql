/*
  Warnings:

  - You are about to drop the column `credits` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "credits",
DROP COLUMN "description",
ADD COLUMN     "course_code" TEXT,
ADD COLUMN     "units" INTEGER;
