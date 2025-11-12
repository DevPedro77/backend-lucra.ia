import AuthService from "./auth_service.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "7d";
class AuthController {
    async login(request, reply) {
        const { telefone } = request.body;
        if (!telefone) {
            return reply.status(400).send({ error: "Telefone é obrigatório" });
        }
        const authService = new AuthService();
        const user = await authService.findUserByTelefone(telefone);
        if (!user) {
            return reply.status(404).send({ error: "Usuário não encontrado" });
        }
        const token = jwt.sign({
            userId: user.id, // ✅ Adicione userId
            telefone: user.telefone
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return reply.send({ user, token });
    }
}
export default AuthController;
