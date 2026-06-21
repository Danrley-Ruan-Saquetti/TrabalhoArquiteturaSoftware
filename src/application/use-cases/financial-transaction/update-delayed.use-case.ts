import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { FinancialTransactionUpdateDelayedDTO, financialTransactionUpdateDelayedSchema } from '@application/dto/financial-transaction/update-delayed.dto'
import { FinancialTransactionSituation } from '@domain/enums/financial-transaction.enum'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'

@Injectable()
export class FinancialTransactionUpdateDelayedUseCase extends UseCase {

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository
  ) {
    super()
  }

  async perform(args: FinancialTransactionUpdateDelayedDTO) {
    const { limit } = this.validator.validate(financialTransactionUpdateDelayedSchema, args)

    const financialTransactions = await this.getFinancialTransactionsDelayed(limit)

    await this.financialTransactionRepository.updateMany({
      where: { id: { in: financialTransactions.map(({ id }) => id) } },
      data: { situation: FinancialTransactionSituation.LATED }
    })
  }

  private async getFinancialTransactionsDelayed(limit?: number) {
    return await this.financialTransactionRepository.findMany({
      where: {
        situation: { not: FinancialTransactionSituation.LATED },
        expiresIn: {
          not: null as any,
          lt: new Date(Date.now())
        }
      },
      orderBy: { id: 'asc' },
      take: limit
    })
  }
}