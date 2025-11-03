import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth_routes.js";
import { authMiddleware } from "../middleware/authAuthenticated.js";
import ReceivesController from "../modules/receives/useCases/createReceives/receives_controller.js";
import PurchaseController from "../modules/purchase/purchase_controller.js";
import DespesasController from "../modules/depesas/useCases/createDespesas/despesas_controller.js";
import ListReceitasController from "../modules/receives/useCases/listReceives/receives_controller.js";
import DeleteReceivesController from "../modules/receives/useCases/deleteReceives/receives_controller.js";

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
  app.post(
    "/receitas",
    {
      preHandler: [authMiddleware],
    },
    receivesController.handle.bind(receivesController)
  );

  // Listando receitas
  app.get(
    "/receitas",
    {
      preHandler: [authMiddleware],
    },
    ListReceitasController.listarPorData.bind(ListReceitasController)
  );

  // Deletando receita por id - CERTIFIQUE-SE QUE ESTÁ AQUI!
  app.delete(
    "/receitas/:id",
    {
      preHandler: [authMiddleware],
    },
    DeleteReceivesController.handle.bind(DeleteReceivesController)
  );

  // Rota de despesas
  const despesasController = new DespesasController();
  app.post(
    "/despesas",
    {
      preHandler: [authMiddleware],
    },
    despesasController.handle.bind(despesasController)
  );
};

export default routes;