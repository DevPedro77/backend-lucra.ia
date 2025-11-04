import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors"
import routes from "../routes/index.js";
import { swaggerConfig } from "../docs/swagger.config.js";

const app = Fastify({ logger: true });
app.register(cors, {
  origin: true,
});

app.register(swaggerConfig);

// Errors
app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({
    error: error.name || "InternalServerError",
    message: error.message,
  });
});

// Rotas
app.register(routes, { prefix: '/api' });
const start = async () => {
  try {
    await app.listen({ port: 8800, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export default app;
