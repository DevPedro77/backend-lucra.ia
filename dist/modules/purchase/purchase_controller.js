import PurchaseService from "./purchase_service.js";
import { PurchaseStatus } from "@prisma/client";
class PurchaseController {
    async handle(request, reply) {
        const { telefone, status, amount, transactionId, name } = request.body;
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
        }
        catch (error) {
            return reply.status(500).send({ error: "Erro ao criar a compra" });
        }
    }
}
export default PurchaseController;
