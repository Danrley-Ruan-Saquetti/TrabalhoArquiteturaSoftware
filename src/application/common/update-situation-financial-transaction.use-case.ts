import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { FinancialTransactionFindUseCase } from '@application/use-cases/financial-transaction/find.use-case'
import { FinancialTransactionUpdateSituationEvent } from '@application/observer/events/financial-transaction/update-situation.event'
import { financialTransactionUpdateSituationSchema, FinancialTransactionUpdateSituationDTO } from '@application/dto/financial-transaction/update-situation.dto'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'

@Injectable()
export abstract class FinancialTransactionUpdateSituationUseCase extends UseCase<FinancialTransactionUpdateSituationEvent> {

  protected financialTransaction: FinancialTransaction

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository,
    private readonly financialTransactionFindUseCase: FinancialTransactionFindUseCase
  ) {
    super()
  }

  async perform(args: FinancialTransactionUpdateSituationDTO) {
    const { bankAccountId, id } = this.validator.validate(financialTransactionUpdateSituationSchema, args)

    this.financialTransaction = (await this.financialTransactionFindUseCase.perform({ id, bankAccountId })).financialTransaction

    const { oldSituation, newSituation } = await this.resolveUpdateSituation()

    const financialTransactionUpdated = await this.saveFinancialTransaction()

    await this.observer.notify('events.financial-transaction.update-situation', {
      financialTransaction: this.financialTransaction,
      oldSituation,
      newSituation,
    })

    return { financialTransaction: financialTransactionUpdated }
  }

  private async resolveUpdateSituation() {
    const oldSituation = this.financialTransaction.situation

    await this.updateSituation(this.financialTransaction)

    const newSituation = this.financialTransaction.situation

    return { oldSituation, newSituation }
  }

  private async saveFinancialTransaction() {
    return await this.financialTransactionRepository.update(this.financialTransaction.id, this.financialTransaction)
  }

  protected abstract updateSituation(financialTransaction: FinancialTransaction): Promise<void>
}