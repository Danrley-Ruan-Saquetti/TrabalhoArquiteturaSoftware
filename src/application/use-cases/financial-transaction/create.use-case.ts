import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { BankAccountInactiveException } from '@application/exceptions/bank-account-inactive.exception'
import { financialTransactionCreateSchema, FinancialTransactionCreateDTO } from '@application/dto/financial-transaction/create.dto'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'
import { DefineInitialSituationFinancialTransactionValueObject } from '@domain/value-objects/define-initial-situation-financial-transaction.value-object'

@Injectable()
export class FinancialTransactionCreateUseCase extends UseCase {

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository,
  ) {
    super()
  }

  async perform(args: FinancialTransactionCreateDTO) {
    const {
      bankAccountId,
      description,
      expiresIn,
      senderRecipient,
      timesToRepeat,
      title,
      type,
      typeOccurrence,
      value,
      dateTimeCompetence,
      frequency
    } = this.validator.validate(financialTransactionCreateSchema, args)

    const bankAccount = await this.findBankAccount(bankAccountId)

    const situation = new DefineInitialSituationFinancialTransactionValueObject({ expiresIn }).getSituation()

    const financialTransaction = new FinancialTransaction({
      bankAccountId: bankAccount.id,
      description,
      expiresIn,
      dateTimeCompetence,
      situation,
      title,
      type,
      senderRecipient,
      value,
      settings: {
        frequency,
        timesToRepeat,
        typeOccurrence,
        countRepeatedOccurrences: 0,
      }
    })

    const financialTransactionCreated = await this.financialTransactionRepository.create(financialTransaction)

    return { financialTransaction: financialTransactionCreated }
  }

  private async findBankAccount(bankAccountId: number) {
    const bankAccount = await this.bankAccountRepository.findById(bankAccountId)

    if (!bankAccount) {
      throw new NotFoundException('Bank Account', `${bankAccountId}`)
    }

    if (!bankAccount.active) {
      throw new BankAccountInactiveException('Financial Transaction cannot be recorded as the bank account is inactive')
    }

    return bankAccount
  }
}