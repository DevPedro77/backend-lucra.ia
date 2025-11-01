/*
  Warnings:

  - Changed the type of `tipo` on the `Despesa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DespesaTiposEnum" AS ENUM ('COMBUSTIVEL', 'ALIMENTACAO', 'OUTRO', 'MANUTENCAO');

-- AlterTable
ALTER TABLE "Despesa" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "DespesaTiposEnum" NOT NULL;
