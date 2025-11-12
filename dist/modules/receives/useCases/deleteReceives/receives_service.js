import prisma from "../../../../shared/prisma.js";
class DeleteReceivesService {
    async execute({ id }) {
        // Verifica se a receita existe
        const receita = await prisma.adicionarReceita.findUnique({
            where: { id: id },
        });
        if (!receita) {
            throw new Error("Receita não encontrada");
        }
        // Deleta a receita
        const deleted = await prisma.adicionarReceita.delete({
            where: { id: id },
        });
        return deleted;
    }
}
export default new DeleteReceivesService();
