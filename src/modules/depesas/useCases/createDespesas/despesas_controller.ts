import { FastifyRequest, FastifyReply } from "fastify";
import DespesasService from "../createDespesas/despesas_service.js";
import { DespesaTiposEnum } from "@prisma/client";
import { Errors } from "../../../../utils/error_handle.js";

class DespesasController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId;

    if (!userId) {
      throw Errors.Unauthorized();
    }

    const despesaService = new DespesasService();
    const { tipo, valor, resumeId } = request.body as {
      tipo: DespesaTiposEnum;
      valor: number;
      resumeId?: string;
    };

    if (!tipo || !valor) {
      throw Errors.BadRequest("Tipo ou valor da despesa não informado");
    }

    // Aqui qualquer erro do service vai subir para o handler global
    const novaDespesa = await despesaService.create(userId, {
      tipo,
      valor,
      resumeId,
    });

    return reply.status(201).send(novaDespesa);
  }
}

export default DespesasController;
