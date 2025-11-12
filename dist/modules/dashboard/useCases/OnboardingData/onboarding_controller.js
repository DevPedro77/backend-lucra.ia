import ReturnDataOnboading from "./onboarding_service.js";
class ReturningDataController {
    async handle(req, reply) {
        const userId = req.user.userId;
        const data = await ReturnDataOnboading.execute(userId);
        return reply.send(data);
    }
}
export default ReturningDataController;
