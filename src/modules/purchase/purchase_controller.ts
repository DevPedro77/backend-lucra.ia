import { FastifyRequest, FastifyReply } from "fastify";
import PurchaseService from "./purchase_service.js";
import { PurchaseStatus } from "@prisma/client";

class PurchaseController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { telefone, status, amount, transactionId, name } = request.body as {
      telefone: string;
      status?: PurchaseStatus;
      amount: number;
      transactionId?: string;
      name: string;
    };

    const purchaseService = new PurchaseService();

    try {
      const newPurchase = await purchaseService.create({
        telefone,
        name,
        status: status ?? PurchaseStatus.PENDING,
        amount,
        transactionId,
      });
      return reply.status(201).send(newPurchase);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar a compra" });
    }
  }
}


export default PurchaseController;