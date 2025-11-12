import cors from "@fastify/cors";
export default async function corsPlugin(fastify) {
    fastify.register(cors, {
        origin: true, // permitir todos ou configurar domínio específico
    });
}
