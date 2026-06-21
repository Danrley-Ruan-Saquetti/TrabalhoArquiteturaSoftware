/*
  Warnings:

  - The values [CP] on the enum `financial_transaction_situation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "financial_transaction_situation_new" AS ENUM ('PE', 'CL', 'LT', 'CN');
ALTER TABLE "financial_transactions" ALTER COLUMN "situation" DROP DEFAULT;
ALTER TABLE "financial_transactions" ALTER COLUMN "situation" TYPE "financial_transaction_situation_new" USING ("situation"::text::"financial_transaction_situation_new");
ALTER TYPE "financial_transaction_situation" RENAME TO "financial_transaction_situation_old";
ALTER TYPE "financial_transaction_situation_new" RENAME TO "financial_transaction_situation";
DROP TYPE "financial_transaction_situation_old";
ALTER TABLE "financial_transactions" ALTER COLUMN "situation" SET DEFAULT 'PE';
COMMIT;
