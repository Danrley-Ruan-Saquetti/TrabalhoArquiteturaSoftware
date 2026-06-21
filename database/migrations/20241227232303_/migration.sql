/*
  Warnings:

  - The values [PUSH,INTERNAL,EMAIL] on the enum `notification_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "notification_type_new" AS ENUM ('P', 'I', 'E');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "notification_type_new" USING ("type"::text::"notification_type_new");
ALTER TYPE "notification_type" RENAME TO "notification_type_old";
ALTER TYPE "notification_type_new" RENAME TO "notification_type";
DROP TYPE "notification_type_old";
COMMIT;
