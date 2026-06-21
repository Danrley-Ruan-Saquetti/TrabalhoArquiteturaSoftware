/*
  Warnings:

  - The `recipient` column on the `emails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "emails" DROP COLUMN "recipient",
ADD COLUMN     "recipient" VARCHAR(45)[];
