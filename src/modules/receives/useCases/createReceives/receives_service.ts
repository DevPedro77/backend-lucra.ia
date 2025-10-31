import prisma from "../../../../shared/prisma.js";

interface ICreateReceive {
  userId: string;
  turnos: "manha" | "tarde" | "noite";
  receita: number;
  diarioId?: string;
  resumeId?: string;
}

class ReceivesService {
  async create({ userId, turnos, receita, diarioId, resumeId }: ICreateReceive) {
    const novaReceita = await prisma.adicionarReceita.create({
      data: {
        userId,
        turnos: turnos,
        receita,
        diarioId,
        resumeId,
      },
    });
    return novaReceita;
  }

  async listByDate(userId: string, date: Date) {
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

export default  ReceivesService;
