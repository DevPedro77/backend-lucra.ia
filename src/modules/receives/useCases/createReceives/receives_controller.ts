import { FastifyRequest, FastifyReply } from "fastify";
import ReceivesService from "./receives_service.js";

class ReceivesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, turnos, receita, diarioId, resumeId } = request.body as {
      userId: string;
      turnos: "manha" | "tarde" | "noite";
      receita: number;
      diarioId?: string;
      resumeId?: string;
    };

    const receivesService = new ReceivesService();

    try {
      const novaReceita = await receivesService.create({
        userId,
        turnos,
        receita,
        diarioId,
        resumeId,
      });
      return reply.status(201).send(novaReceita);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar a receita" });
    }
  }
}

export default ReceivesController;