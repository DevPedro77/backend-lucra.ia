import prisma from "../../../../shared/prisma.js";
class ReceivesService {
    async create(userId, data) {
        console.log("========== DEBUG SERVICE ==========");
        console.log("🔍 userId recebido:", userId);
        console.log("🔍 tipo:", typeof userId);
        console.log("🔍 data:", data);
        const { turnos, receita, diarioId, resumeId } = data;
        console.log("🔍 Dados para Prisma:", {
            userId,
            turnos,
            receita,
            diarioId,
            resumeId,
        });
        const novaReceita = await prisma.adicionarReceita.create({
            data: {
                userId,
                turnos,
                receita,
                diarioId,
                resumeId,
            },
        });
        return novaReceita;
    }
    async listByDate(userId, date) {
        return prisma.adicionarReceita.findMany({
            where: {
                userId,
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999)),
                },
            },
            orderBy: { createdAt: "asc" },
        });
    }
}
export default ReceivesService;
