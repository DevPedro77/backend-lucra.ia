import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import routes from "../routes/index.js";
import { swaggerConfig } from "../docs/swagger.config.js";
import { healthRoutes } from "../routes/health_routes.js";
const PORT = parseInt(process.env.PORT || "8800", 10);
const NODE_ENV = process.env.NODE_ENV || "development";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);
const RATE_LIMIT_TIME_WINDOW = parseInt(process.env.RATE_LIMIT_TIME_WINDOW || "60000", 10);
const app = Fastify({
    logger: NODE_ENV === "development" ? {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    } : true,
});
// CORS configurável
app.register(cors, {
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(","),
    credentials: true,
});
// Rate Limiting
app.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: RATE_LIMIT_TIME_WINDOW,
});
// Swagger
app.register(swaggerConfig);
// Health Check
app.register(healthRoutes);
// Errors
app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
        error: error.name || "InternalServerError",
        message: NODE_ENV === "development" ? error.message : "Erro interno do servidor",
    });
});
// Rotas
app.register(routes, { prefix: '/api' });
const start = async () => {
    try {
        await app.listen({ port: PORT, host: "0.0.0.0" });
        app.log.info(`🚀 Server running on port ${PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
export default app;
