-- CreateTable
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);
