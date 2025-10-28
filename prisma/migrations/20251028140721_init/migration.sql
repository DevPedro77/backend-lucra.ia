-- CreateEnum
CREATE TYPE "VeiculoEnum" AS ENUM ('carro', 'moto', 'outro');

-- CreateEnum
CREATE TYPE "PeriodoEnum" AS ENUM ('diario', 'semanal', 'mensal');

-- CreateEnum
CREATE TYPE "TurnoEnum" AS ENUM ('manha', 'tarde', 'noite');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "telefone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingId" TEXT,
    "diarioId" TEXT,
    "resumeId" TEXT,
    "despesasId" TEXT,
    "sender" TEXT NOT NULL,
    "context" TEXT,
    "message" TEXT NOT NULL,
    "historico" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meta_ganhos_diario" INTEGER NOT NULL,
    "meta_ganhos_semanal" INTEGER NOT NULL,
    "meta_ganhos_mensal" INTEGER NOT NULL,
    "gasto_diario_combustivel" INTEGER NOT NULL,
    "gasto_diario_alimentacao" INTEGER NOT NULL,
    "veiculo" "VeiculoEnum" NOT NULL,
    "periodo" "PeriodoEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiarioMeta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "diario" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "onboardingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiarioMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdicionarReceita" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turnos" "TurnoEnum" NOT NULL,
    "receita" INTEGER NOT NULL,
    "diarioId" TEXT,
    "resumeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdicionarReceita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeFinancas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "diarioId" TEXT,
    "ganhos_semana" TEXT,
    "ganhos_mes" TEXT,
    "gastos_semana" TEXT,
    "gastos_mes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeFinancas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "resumeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telefone_key" ON "User"("telefone");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "Onboarding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_diarioId_fkey" FOREIGN KEY ("diarioId") REFERENCES "DiarioMeta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "ResumeFinancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_despesasId_fkey" FOREIGN KEY ("despesasId") REFERENCES "Despesa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onboarding" ADD CONSTRAINT "Onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiarioMeta" ADD CONSTRAINT "DiarioMeta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiarioMeta" ADD CONSTRAINT "DiarioMeta_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "Onboarding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdicionarReceita" ADD CONSTRAINT "AdicionarReceita_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdicionarReceita" ADD CONSTRAINT "AdicionarReceita_diarioId_fkey" FOREIGN KEY ("diarioId") REFERENCES "DiarioMeta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdicionarReceita" ADD CONSTRAINT "AdicionarReceita_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "ResumeFinancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeFinancas" ADD CONSTRAINT "ResumeFinancas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeFinancas" ADD CONSTRAINT "ResumeFinancas_diarioId_fkey" FOREIGN KEY ("diarioId") REFERENCES "DiarioMeta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "ResumeFinancas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
