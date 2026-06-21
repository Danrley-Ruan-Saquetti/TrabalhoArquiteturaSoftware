import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { BankAccountUpdateBalanceEvent } from '@application/observer/events/bank-account/update-balance.event'
import { BankAccountUpdateBalanceDTO, bankAccountUpdateBalanceSchema } from '@application/dto/bank-account/update-balance.dto'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountUpdateBalanceUseCase extends UseCase<BankAccountUpdateBalanceEvent> {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {
    super()
  }

  async perform(args: BankAccountUpdateBalanceDTO) {
    const { bankAccountId, type, value } = this.validator.validate(bankAccountUpdateBalanceSchema, args)

    const bankAccount = await this.getBankAccount(bankAccountId)
    this.updateBalance(bankAccount, type, value)

    const bankAccountUpdated = await this.bankAccountRepository.update(bankAccount.id, bankAccount)
    await this.observer.notify('events.bank-account.balance-changed', { bankAccount: bankAccountUpdated, type, value })

    return { bankAccount: bankAccountUpdated }
  }

  private async getBankAccount(id: number) {
    const bankAccount = await this.bankAccountRepository.findById(id)

    if (!bankAccount) {
      throw new NotFoundException('Bank Account', `${id}`)
    }

    return bankAccount
  }

  private updateBalance(bankAccount: BankAccount, type: 'IN' | 'OUT', value: number) {
    if (type == 'IN') {
      return this.increaseBalance(bankAccount, value)
    }

    this.decreaseBalance(bankAccount, value)
  }

  private increaseBalance(bankAccount: BankAccount, value: number) {
    bankAccount.balance += value
  }

  private decreaseBalance(bankAccount: BankAccount, value: number) {
    bankAccount.balance -= value
  }
}