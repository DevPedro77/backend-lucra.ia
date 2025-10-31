import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function corsPlugin(fastify: FastifyInstance) {
  fastify.register(cors, {
    origin: true, // permitir todos ou configurar domínio específico
  });
}
