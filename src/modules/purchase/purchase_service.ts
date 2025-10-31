import prisma from "../../shared/prisma.js";
import { PurchaseStatus } from "@prisma/client";


interface ICreatePurchase {
  telefone: string
  name: string
  status?: PurchaseStatus
  amount: number
  transactionId?: string
}

class PurchaseService {
  async create({ telefone, name, status = PurchaseStatus.PENDING, amount, transactionId }: ICreatePurchase) {
    const newPurchase = await prisma.purchase.create({
      data: {
        telefone,
        status,
        amount,
        transactionId,
        name,
      },
    });
    return newPurchase;
  }
}


export default PurchaseService;