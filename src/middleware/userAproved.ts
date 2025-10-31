import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../shared/prisma.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "7d";

export async function createUserAndGenerateJWT(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.purchaseData) {
    return reply.status(400).send({ error: "Dados da compra não encontrados" });
  }

  const { telefone, name } = request.purchaseData;

  // Verifica se usuário já existe
  let user = await prisma.user.findUnique({
    where: { telefone },
  });

  // Cria usuário se não existir
  if (!user) {
    user = await prisma.user.create({
      data: {
        telefone,
        name,
      },
    });
  }

  // Gera JWT
  const token = jwt.sign(
    { userId: user.id, telefone: user.telefone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Retorna resposta final
  return reply.status(200).send({
    user: {
      id: user.id,
      telefone: user.telefone,
      name: user.name,
    },
    token,
  });
}
