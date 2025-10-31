import { FastifyInstance } from "fastify";
import { validatePurchaseStatus } from "../middleware/validaPix.js";
import { createUserAndGenerateJWT } from "../middleware/userAproved.js";
import AuthController from "../modules/auth/auth_controller.js";

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  // Cadastro de usuário após pagamento
  fastify.post(
    "/cadastro-usuario",
    { preHandler: [validatePurchaseStatus, createUserAndGenerateJWT] },
    async () => {
      // nada aqui. response já enviado pelos middlewares.
    }
  );

  // Login simples só com telefone (gera novo JWT)
  fastify.post("/login", async (request, reply) => {
    return authController.login(request, reply);
  });
}
