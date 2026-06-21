import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { FinancialTransactionDeleteEvent } from '@application/observer/events/financial-transaction/delete.event'
import { FinancialTransactionFindUseCase } from '@application/use-cases/financial-transaction/find.use-case'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'
import { FinancialTransactionDeleteDTO, financialTransactionDeleteSchema } from '@application/dto/financial-transaction/delete.dto'

@Injectable()
export class FinancialTransactionDeleteUseCase extends UseCase<FinancialTransactionDeleteEvent> {

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository,
    private readonly financialTransactionFindUseCase: FinancialTransactionFindUseCase
  ) {
    super()
  }

  async perform(args: FinancialTransactionDeleteDTO) {
    const { bankAccountId, id } = this.validator.validate(financialTransactionDeleteSchema, args)

    const { financialTransaction } = await this.financialTransactionFindUseCase.perform({ id, bankAccountId })

    await this.financialTransactionRepository.delete(financialTransaction.id)

    await this.observer.notify('events.financial-transaction.deleted', { financialTransaction })
  }
}