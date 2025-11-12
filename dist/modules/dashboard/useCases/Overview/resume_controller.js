import DashboardService from "./resume_service.js";
class DashboardController {
    async handle(req, reply) {
        const userId = req.user.userId;
        const data = await DashboardService.create(userId);
        return reply.send(data);
    }
}
export default DashboardController;
