import prisma from "../../shared/prisma.js";

export interface AuthUser {
  id: string;        // ✅ Adicione o id
  telefone: string;
}

class AuthService {
  async findUserByTelefone(telefone: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: { telefone },
      select: {
        id: true,        // ✅ Adicione o id no select
        telefone: true
      }
    });
  }
}

export default AuthService;