import { FastifyRequest, FastifyReply } from "fastify";
import ReceitasService from "../listReceives/receives_service.js";

class ListReceitasController {
  // No controller
async listarPorData(req: FastifyRequest, reply: FastifyReply) {
  console.log('🔐 req.user completo:', req.user); // ← LOG 1
  
  const userId = req.user?.userId;
  
  console.log('👤 userId extraído:', userId); // ← LOG 2
  
  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const dados = await ReceitasService.listarPorData(userId);
  return reply.status(200).send(dados);
}
}

export default new ListReceitasController();