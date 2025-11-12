import prisma from "../../../../shared/prisma.js";
class DespesasService {
    async create(userId, data) {
        const { tipo, valor, resumeId } = data;
        const novaDespesa = await prisma.despesa.create({
            data: {
                userId,
                tipo,
                valor,
                resumeId,
            },
        });
        return novaDespesa;
    }
}
export default DespesasService;
