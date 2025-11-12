import prisma from "../../shared/prisma.js";
import { PurchaseStatus } from "@prisma/client";
class PurchaseService {
    async create({ telefone, name, status = PurchaseStatus.PENDING, amount, transactionId }) {
        const newPurchase = await prisma.purchase.create({
            data: {
                telefone,
                status,
                amount,
                transactionId,
                name,
            },
        });
        return newPurchase;
    }
}
export default PurchaseService;
