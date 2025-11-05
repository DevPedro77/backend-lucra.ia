/*
  Warnings:

  - Changed the type of `periodo` on the `Onboarding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "periodo",
ADD COLUMN     "periodo" "TurnoEnum" NOT NULL;
