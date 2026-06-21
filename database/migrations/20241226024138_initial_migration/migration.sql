-- CreateEnum
CREATE TYPE "people_type" AS ENUM ('NP', 'LE');

-- CreateEnum
CREATE TYPE "people_gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('C', 'A');

-- CreateTable
CREATE TABLE "peoples" (
    "id" SERIAL NOT NULL,
    "type" "people_type" NOT NULL DEFAULT 'NP',
    "name" VARCHAR(128) NOT NULL,
    "cpf_cnpj" VARCHAR(14) NOT NULL,
    "gender" "people_gender",
    "date_of_birth" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peoples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "type" "user_type" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "code" VARCHAR(15) NOT NULL,
    "login" VARCHAR(254) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "last_access" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" SERIAL NOT NULL,
    "people_id" INTEGER NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "peoples_cpf_cnpj_key" ON "peoples"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_people_type" ON "users"("people_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_type" ON "users"("login", "type");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_code_key" ON "bank_accounts"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
