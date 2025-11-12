import prisma from "../../../../shared/prisma.js";
class DashboardService {
    async create(userId) {
        const hoje = new Date();
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7);
        const trintaDiasAtras = new Date(hoje);
        trintaDiasAtras.setDate(hoje.getDate() - 30);
        const receita7 = await prisma.adicionarReceita.aggregate({
            _sum: { receita: true },
            where: { userId, createdAt: { gte: seteDiasAtras } },
        });
        const receita30 = await prisma.adicionarReceita.aggregate({
            _sum: { receita: true },
            where: { userId, createdAt: { gte: trintaDiasAtras } },
        });
        const despesa7 = await prisma.despesa.aggregate({
            _sum: { valor: true },
            where: { userId, createdAt: { gte: seteDiasAtras } },
        });
        const despesa30 = await prisma.despesa.aggregate({
            _sum: { valor: true },
            where: { userId, createdAt: { gte: trintaDiasAtras } },
        });
        return {
            receitas: {
                ultimos7dias: receita7._sum.receita || 0,
                ultimos30dias: receita30._sum.receita || 0,
            },
            despesas: {
                ultimos7dias: despesa7._sum.valor || 0,
                ultimos30dias: despesa30._sum.valor || 0,
            },
        };
    }
}
// Exporta uma instância
export default new DashboardService();
