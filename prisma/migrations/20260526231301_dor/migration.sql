/*
  Warnings:

  - A unique constraint covering the columns `[token_acesso]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "token_acesso" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_token_acesso_key" ON "Usuario"("token_acesso");
