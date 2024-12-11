-- CreateEnum
CREATE TYPE "Risk" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "risk" "Risk" NOT NULL DEFAULT 'low',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IsSuspicious" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IsSuspicious_pkey" PRIMARY KEY ("id")
);
