import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors"
import routes from "../routes/index.js";

const app = Fastify({ logger: true });
app.register(cors, {
  origin: true,
});

// Errors
app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({
    error: error.name || "InternalServerError",
    message: error.message,
  });
});

// Rotas

app.register(routes);
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
