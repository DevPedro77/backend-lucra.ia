import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth_routes.js";
import { authMiddleware } from "../middleware/authAuthenticated.js";
import ReceivesController from "../modules/receives/useCases/createReceives/receives_controller.js";
import PurchaseController from "../modules/purchase/purchase_controller.js";
import DespesasController from "../modules/depesas/useCases/createDespesas/despesas_controller.js";
import ListReceitasController from "../modules/receives/useCases/listReceives/receives_controller.js";
import DeleteReceivesController from "../modules/receives/useCases/deleteReceives/receives_controller.js";
import ListaDespesasController from "../modules/depesas/useCases/listDespesas/despesas_controller.js";
import DeleteDespesasController from "../modules/depesas/useCases/deleteDespesas/despesas_controller.js";
import OnboardingController from "../modules/onboarding/onboarding_controller.js";
import DashboardController from "../modules/dashboard/useCases/Overview/resume_controller.js";
import ReturningDataController from "../modules/dashboard/useCases/OnboardingData/onboarding_controller.js";

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

  // Deletando receita por id 
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
  //Listar despesas
app.get("/despesas", {
  preHandler: [authMiddleware],
}, ListaDespesasController.list.bind(ListaDespesasController))

//Deletando despesas por ID
const deleteDespesasController = new DeleteDespesasController();
app.delete("/despesas/:id", {
  preHandler: [authMiddleware]
}, deleteDespesasController.delete.bind(deleteDespesasController));

// Onboarding
const onboardingController = new OnboardingController()
app.post("/onboarding", {
  preHandler: [authMiddleware]
}, onboardingController.execute.bind(onboardingController))
// Dashboard --> Receitas e despesas
const dashboardController = new DashboardController();
app.get("/dashboard", {
  preHandler: [authMiddleware]
},dashboardController.handle.bind(dashboardController))
// Dashboard -> Metas e gastos 
const returningData = new ReturningDataController()
app.get("/dashboard/onboarding", {
  preHandler: [authMiddleware]
},returningData.handle.bind(returningData))
};


export default routes;