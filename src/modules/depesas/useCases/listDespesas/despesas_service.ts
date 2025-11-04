import prisma from "../../../../shared/prisma.js";

class ListDespesas {
  async handle(userId: string) {
    console.log('🔍 SERVICE recebeu userId:', userId); // ← LOG 3
    console.log('🔍 Tipo do userId:', typeof userId); // ← LOG 4


    const listarDespesas = await prisma.despesa.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      
    })


    return listarDespesas;
  }
}


export default new ListDespesas();