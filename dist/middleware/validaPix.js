import prisma from "../shared/prisma.js";
import { PurchaseStatus } from "@prisma/client";
/**
 * Middleware para validar status de pagamento
 * Apenas valida se a compra está PAID
 * Se estiver, armazena os dados no request para o próximo middleware
 */
export async function validatePurchaseStatus(request, reply) {
    const { telefone } = request.body;
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
