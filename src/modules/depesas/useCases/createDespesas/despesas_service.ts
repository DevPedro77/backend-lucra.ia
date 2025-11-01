import prisma from "../../../../shared/prisma.js";
import { DespesaTiposEnum } from "@prisma/client";

interface DespesasData {
  tipo: DespesaTiposEnum;
  valor: number;
  resumeId?: string;
}


class DespesasService {
  async create(userId: string, data: DespesasData) {
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