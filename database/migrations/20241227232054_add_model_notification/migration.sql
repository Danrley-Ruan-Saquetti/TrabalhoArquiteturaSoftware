-- CreateEnum
CREATE TYPE "notification_situation" AS ENUM ('IQ', 'ER', 'SN');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('PUSH', 'INTERNAL', 'EMAIL');

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(45) NOT NULL,
    "body" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "situation" "notification_situation" NOT NULL DEFAULT 'IQ',
    "send_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "recipient" VARCHAR(45) NOT NULL,
    "sender" VARCHAR(45) NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_id_fkey" FOREIGN KEY ("id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
