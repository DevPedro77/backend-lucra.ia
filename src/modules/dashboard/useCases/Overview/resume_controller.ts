import { FastifyRequest, FastifyReply } from "fastify";
import DashboardService from "./resume_service.js";

class DashboardController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user!.userId;
    const data = await DashboardService.create(userId);
    return reply.send(data);
  }
}

export default  DashboardController;
