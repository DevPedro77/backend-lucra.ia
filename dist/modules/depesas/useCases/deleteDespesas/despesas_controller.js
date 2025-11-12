import DeleteDespesasService from "./despesas_service.js";
class DeleteDespesasController {
    async delete(req, reply) {
        const userId = req.user.userId;
        const { id } = req.params;
        const deleteDespesasService = new DeleteDespesasService();
        try {
            await deleteDespesasService.execute({ id, userId });
            return reply.code(200).send({ ok: true });
        }
        catch (err) {
            return reply.code(404).send("ERROR");
        }
    }
}
export default DeleteDespesasController;
