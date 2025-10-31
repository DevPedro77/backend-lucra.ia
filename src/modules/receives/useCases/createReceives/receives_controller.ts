import { FastifyRequest, FastifyReply } from "fastify";
import ReceivesService from "./receives_service.js";

class ReceivesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    console.log("========== DEBUG CONTROLLER ==========");
    console.log("🔍 request.user:", JSON.stringify(request.user, null, 2));
    console.log("🔍 request.headers:", JSON.stringify(request.headers, null, 2));
    
    const userId = request.user?.userId;
    
    console.log("🔍 userId extraído:", userId);
    console.log("🔍 tipo:", typeof userId);
    
    if (!userId) {
      console.log("❌ ERRO: userId está undefined!");
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const { turnos, receita, diarioId, resumeId } = request.body as {
      turnos: "manha" | "tarde" | "noite";
      receita: number;
      diarioId?: string;
      resumeId?: string;
    };

    console.log("🔍 Body:", { turnos, receita, diarioId, resumeId });

    const receivesService = new ReceivesService();

    try {
      console.log("🔍 Chamando create com userId:", userId);
      
      const novaReceita = await receivesService.create(
        String(userId),
        {
          turnos,
          receita,
          diarioId,
          resumeId,
        }
      );
      
      console.log("✅ Sucesso:", novaReceita);
      return reply.status(201).send(novaReceita);
    } catch (error) { 
      console.error("❌ ERRO:", error);
      return reply.status(500).send(error);
    }
  }
}

export default ReceivesController;