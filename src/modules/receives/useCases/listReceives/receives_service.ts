import prisma from "../../../../shared/prisma.js";

class ReceitasService {
  // No service
async listarPorData(userId: string) {
  console.log('🔍 SERVICE recebeu userId:', userId); // ← LOG 3
  console.log('🔍 Tipo do userId:', typeof userId); // ← LOG 4
  
  const receitas = await prisma.adicionarReceita.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  
  console.log('📦 Retornou', receitas.length, 'receitas'); // ← LOG 5
  
  return receitas;
}
}

export default new ReceitasService();
