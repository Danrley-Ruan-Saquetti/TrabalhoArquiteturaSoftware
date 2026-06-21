import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { FinancialTransactionFindUseCase } from '@application/use-cases/financial-transaction/find.use-case'
import { OperationClosedFinancialTransactionNotAllowedException } from '@application/exceptions/operation-closed-financial-transaction-not-allowed.exception'
import { FinancialTransactionUpdateDTO, financialTransactionUpdateSchema } from '@application/dto/financial-transaction/update.dto'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'
import { DefineInitialSituationFinancialTransactionValueObject } from '@domain/value-objects/define-initial-situation-financial-transaction.value-object'
import { FinancialTransactionFrequency, FinancialTransactionTypeOccurrence } from '@domain/enums/financial-transaction.enum'

@Injectable()
export class FinancialTransactionUpdateUseCase extends UseCase {

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository,
    private readonly financialTransactionFindUseCase: FinancialTransactionFindUseCase
  ) {
    super()
  }

  async perform(args: FinancialTransactionUpdateDTO) {
    const { bankAccountId, id, ...data } = this.validator.validate(financialTransactionUpdateSchema, args)

    const { financialTransaction } = await this.financialTransactionFindUseCase.perform({ id, bankAccountId })

    if (financialTransaction.isCompleted()) {
      throw new OperationClosedFinancialTransactionNotAllowedException(
        'It is not possible to update the financial transaction as it has been closed',
        { situation: financialTransaction.situation }
      )
    }

    this.updateDataFinancialTransaction(financialTransaction, data)

    const financialTransactionUpdated = await this.financialTransactionRepository.update(financialTransaction.id, financialTransaction)

    return { financialTransaction: financialTransactionUpdated }
  }

  private updateDataFinancialTransaction(
    financialTransaction: FinancialTransaction,
    data: {
      title?: string
      senderRecipient?: string
      description?: string | null
      timesToRepeat?: number | null
      typeOccurrence?: FinancialTransactionTypeOccurrence
      frequency?: FinancialTransactionFrequency | null
      expiresIn?: Date | null
      dateTimeCompetence?: Date
      value?: number
    }
  ) {
    if (data.dateTimeCompetence) financialTransaction.dateTimeCompetence = data.dateTimeCompetence
    if (data.description) financialTransaction.description = data.description
    if (data.senderRecipient) financialTransaction.senderRecipient = data.senderRecipient
    if (data.title) financialTransaction.title = data.title
    if (data.value) financialTransaction.value = data.value
    if (data.frequency) financialTransaction.settings.frequency = data.frequency
    if (data.timesToRepeat) financialTransaction.settings.timesToRepeat = data.timesToRepeat
    if (data.typeOccurrence) financialTransaction.settings.typeOccurrence = data.typeOccurrence
    if (data.expiresIn) {
      financialTransaction.expiresIn = data.expiresIn
      financialTransaction.situation = new DefineInitialSituationFinancialTransactionValueObject({ expiresIn: data.expiresIn }).getSituation()
    }
  }
}