import { FastifyRequest, FastifyReply } from "fastify";
import listaDespesas from "./despesas_service.js";

class ListaDespesasController {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.userId;

    if (!userId) {
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const listDespesas = await listaDespesas.handle(userId);
    return reply.status(200).send(listDespesas);
  }
}



export default new ListaDespesasController();