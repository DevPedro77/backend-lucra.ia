import { FastifyRequest, FastifyReply } from "fastify";
import OnboardingService from "./onboarding_service.js";

class OnboardingController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.userId;

    const {
      meta_ganhos_diario,
      meta_ganhos_semanal,
      meta_ganhos_mensal,
      gasto_diario_combustivel,
      gasto_diario_alimentacao,
      veiculo,
      periodo
    } = request.body as any;

    const service = new OnboardingService();

    try {
      const result = await service.handle({
        userId,
        meta_ganhos_diario,
        meta_ganhos_semanal,
        meta_ganhos_mensal,
        gasto_diario_combustivel,
        gasto_diario_alimentacao,
        veiculo,
        periodo
      });

      return reply.status(201).send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}

export default OnboardingController;
