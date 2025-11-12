/*
  Warnings:

  - The `status` column on the `Encomenda` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusEncomenda" AS ENUM ('PENDENTE', 'ENTREGUE', 'CANCELADA');

-- AlterTable
ALTER TABLE "Encomenda" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEncomenda" NOT NULL DEFAULT 'PENDENTE';
