import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth_routes.js";
import { authMiddleware } from "../middleware/authAuthenticated.js";
import ReceivesController from "../modules/receives/useCases/createReceives/receives_controller.js";
import PurchaseController from "../modules/purchase/purchase_controller.js";
import DespesasController from "../modules/depesas/useCases/createDespesas/despesas_controller.js";

const routes = (app: FastifyInstance) => {
  app.register(authRoutes);

  app.get("/", async () => {
    return { message: "Servidor Rodando" };
  });

  // Rota de criar Order
  const purchaseController = new PurchaseController();
  app.post("/compras", purchaseController.handle.bind(purchaseController));
// Rota de receitas/ganhos
  const receivesController = new ReceivesController();
  app.post("/receitas", {
    preHandler: [authMiddleware]  
  }, receivesController.handle.bind(receivesController));

  // Rota de despesas
  const despesasController = new DespesasController();
  app.post("/despesas", {
    preHandler: [authMiddleware]
  }, despesasController.handle.bind(despesasController))
};

export default routes;