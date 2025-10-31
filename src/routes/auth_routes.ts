import { FastifyInstance } from "fastify";
import { validatePurchaseStatus } from "../middleware/validaPix.js";
import { createUserAndGenerateJWT } from "../middleware/userAproved.js";

export async function authRoutes(fastify: FastifyInstance) {
  // Cadastro de usuário após pagamento
  fastify.post(
    "/cadastro-usuario",
    { preHandler: [validatePurchaseStatus, createUserAndGenerateJWT] },
    async (request, reply) => {
      // middleware já envia a resposta
    }
  );

  // Login simples só com telefone
  fastify.post("/login", async (request, reply) => {
    // implementar login com JWT
  });
}
