import prisma from "../../shared/prisma.js";
class OnboardingService {
    async handle(data) {
        const { userId, meta_ganhos_diario, meta_ganhos_semanal, meta_ganhos_mensal, gasto_diario_combustivel, gasto_diario_alimentacao, veiculo, periodo } = data;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardDone: true }
        });
        if (!user)
            throw new Error("Usuário não encontrado");
        if (user.onboardDone) {
            throw new Error("Onboarding já concluído");
        }
        const onboarding = await prisma.onboarding.create({
            data: {
                userId: userId,
                meta_ganhos_diario,
                meta_ganhos_semanal,
                meta_ganhos_mensal,
                gasto_diario_combustivel,
                gasto_diario_alimentacao,
                veiculo,
                periodo
            }
        });
        await prisma.user.update({
            where: { id: userId },
            data: { onboardDone: true }
        });
        return onboarding;
    }
}
export default OnboardingService;
