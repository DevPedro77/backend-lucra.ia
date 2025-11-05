import prisma from "../../../../shared/prisma.js";

interface DeleteDespesasData {
  id: string;
  userId: string;
}

class DeleteDespesasService {
  async execute({ id, userId }: DeleteDespesasData) {
    // busca a despesa e valida o dono
    const despesa = await prisma.despesa.findFirst({
      where: {
        id: id,
        userId: userId,   // garante que pertence ao usuário
      },
    });

    if (!despesa) {
      throw new Error("Despesa não encontrada ou não pertence ao usuário");
    }

    const deleted = await prisma.despesa.delete({
      where: { id },
    });

    return deleted;
  }
}

export default DeleteDespesasService;
