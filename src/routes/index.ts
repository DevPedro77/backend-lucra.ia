import { FastifyInstance } from "fastify";
import ReceivesController from "../modules/receives/useCases/createReceives/receives_controller.js";
import PurchaseController from "../modules/purchase/purchase_controller.js";
import { authRoutes } from "./auth_routes.js";
import { authMiddleware } from "../middleware/authAuthenticated.js";

const routes = (app: FastifyInstance) => {
  app.register(authRoutes);

  app.get("/", async () => {
    return { message: "Servidor Rodando" };
  });

  const purchaseController = new PurchaseController();
  app.post("/compras", purchaseController.handle.bind(purchaseController));

  const receivesController = new ReceivesController();
  app.post("/receitas", {
    preHandler: [authMiddleware]  // ✅ ADICIONE ESTA LINHA
  }, receivesController.handle.bind(receivesController));
};

export default routes;