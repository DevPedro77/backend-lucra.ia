import prisma from "../shared/prisma.js";
export async function healthRoutes(fastify) {
    fastify.get("/health", async (request, reply) => {
        try {
            // Verifica conexão com o banco
            await prisma.$queryRaw `SELECT 1`;
            return reply.send({
                status: "healthy",
                timestamp: new Date().toISOString(),
                database: "connected",
            });
        }
        catch (error) {
            return reply.status(503).send({
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                database: "disconnected",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
}
