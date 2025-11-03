import { FastifyRequest, FastifyReply } from "fastify";
import DeleteReceivesService from "./receives_service.js";

class DeleteReceivesController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };

      if (!id) {
        return reply.status(400).send({ error: "ID é obrigatório" });
      }

      const deleted = await DeleteReceivesService.execute({ id });

      return reply.status(200).send({
        message: "Receita deletada com sucesso",
        data: deleted,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Receita não encontrada") {
          return reply.status(404).send({ error: error.message });
        }
        return reply.status(500).send({ error: error.message });
      }
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  }
}

export default new DeleteReceivesController();