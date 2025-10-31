import prisma from "../../shared/prisma.js";

export interface AuthUser {
  telefone: string;
}

class AuthService {
  async findUserByTelefone(telefone: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: { telefone },
      select: {
        telefone: true
      }
    });
  }
}

export default AuthService;
