import prisma from "../../shared/prisma.js";
class AuthService {
    async findUserByTelefone(telefone) {
        return prisma.user.findUnique({
            where: { telefone },
            select: {
                id: true, // ✅ Adicione o id no select
                telefone: true
            }
        });
    }
}
export default AuthService;
