/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `IsSuspicious` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IsSuspicious_walletAddress_key" ON "IsSuspicious"("walletAddress");
