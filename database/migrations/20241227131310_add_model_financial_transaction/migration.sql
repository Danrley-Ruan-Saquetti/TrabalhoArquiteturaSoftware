-- CreateEnum
CREATE TYPE "financial_transaction_type" AS ENUM ('E', 'I');

-- CreateEnum
CREATE TYPE "financial_transaction_frequency" AS ENUM ('D', 'W', 'M', 'Q', 'S', 'A');

-- CreateEnum
CREATE TYPE "financial_transaction_type_occurrence" AS ENUM ('S', 'P');

-- CreateEnum
CREATE TYPE "financial_transaction_situation" AS ENUM ('PE', 'PO', 'PP', 'RV', 'PR', 'LT', 'CN');

-- CreateTable
CREATE TABLE "financial_transactions" (
    "id" SERIAL NOT NULL,
    "bank_account_id" INTEGER NOT NULL,
    "title" VARCHAR(55) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "value" INTEGER NOT NULL,
    "type" "financial_transaction_type" NOT NULL,
    "situation" "financial_transaction_situation" NOT NULL DEFAULT 'PE',
    "sender_recipient" TEXT NOT NULL,
    "expires_in" TIMESTAMPTZ(3),
    "date_time_competence" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settings" JSONB NOT NULL DEFAULT '{"isObservable": false,"isSendNotification": false,"timesToRepeat": 0,"countRepeatedOccurrences": 0,"typeOccurrence": "S","frequency": null}',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
