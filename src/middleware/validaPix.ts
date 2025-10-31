import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../shared/prisma.js";
import { PurchaseStatus } from "@prisma/client";

// Extendendo FastifyRequest para armazenar dados
declare module "fastify" {
  interface FastifyRequest {
    purchaseData?: {
      telefone: string;
      name?: string;
      status: PurchaseStatus;
    };
  }
}

/**
 * Middleware para validar status de pagamento
 * Apenas valida se a compra está PAID
 * Se estiver, armazena os dados no request para o próximo middleware
 */
export async function validatePurchaseStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { telefone } = request.body as { telefone: string };

  if (!telefone) {
    return reply.status(400).send({ error: "Telefone é obrigatório" });
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      telefone,
      status: PurchaseStatus.PAID,
    },
    select: {
      telefone: true,
      name: true,
      status: true,
    },
  });

  if (!purchase) {
    return reply.status(403).send({ error: "Pagamento não aprovado" });
  }

  // Armazena os dados no request para o próximo middleware
  request.purchaseData = purchase;

  // Não envia resposta aqui! Próximo middleware continuará o fluxo
}
