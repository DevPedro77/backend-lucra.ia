import { FastifyPluginAsync } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

export const swaggerConfig: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Lucra AI API",
        description: "Documentação da API Lucra AI",
        version: "1.0.0",
      },
      servers: [
        { url: "http://127.0.0.1:8800", description: "Servidor local" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      tags: [
        { name: "Auth", description: "Rotas de autenticação" },
        { name: "Receita", description: "Rotas de recebimentos" },
        { name: "Compra", description: "Rotas de compras" },
        { name: "Despesas", description: "Rotas de despesas" },
        { name: "Cadastrar usuario", description: "Rotas de cadastro de usuario" },
        { name: "Health", description: "Verificação de saúde da API" },
      ],
    },
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
  });
};
