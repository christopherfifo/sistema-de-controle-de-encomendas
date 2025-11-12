/*
  Warnings:

  - A unique constraint covering the columns `[codigo_acesso]` on the table `Condominio` will be added. If there are existing duplicate values, this will fail.
  - The required column `codigo_acesso` was added to the `Condominio` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `limite_condominios` to the `Plano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limite_usuarios` to the `Plano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Condominio" ADD COLUMN     "codigo_acesso" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plano" ADD COLUMN     "limite_condominios" INTEGER NOT NULL,
ADD COLUMN     "limite_usuarios" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Condominio_codigo_acesso_key" ON "Condominio"("codigo_acesso");
