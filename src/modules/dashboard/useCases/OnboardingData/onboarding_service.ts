import prisma from "../../../../shared/prisma.js";

class ReturnDataOnboading {
  async execute(userId: string){
    // tem dados lá ?
    const onboardingTrue = await prisma.user.findFirst({
      where: {
        onboardDone: true
      },
    })


    if(!onboardingTrue){
      return console.log("Ainda nao cadastrado")
    } else {
      const onboardingData = await prisma.onboarding.findMany({
        where: {userId}
      })

      return onboardingData;
    }


  }
}


export default new ReturnDataOnboading();