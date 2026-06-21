import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { BankAccountInactiveException } from '@application/exceptions/bank-account-inactive.exception'
import { BankAccountUpdateDTO, bankAccountUpdateSchema } from '@application/dto/bank-account/update.dto'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountUpdateUseCase extends UseCase {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
  ) {
    super()
  }

  async perform(args: BankAccountUpdateDTO) {
    const { id, name } = this.validator.validate(bankAccountUpdateSchema, args)

    const bankAccount = await this.findBankAccount(id)

    if (name) bankAccount.name = name

    const bankAccountUpdate = await this.bankAccountRepository.update(bankAccount.id, bankAccount)

    return { bankAccount: bankAccountUpdate }
  }

  private async findBankAccount(id: number) {
    const bankAccount = await this.bankAccountRepository.findById(id)

    if (!bankAccount) {
      throw new NotFoundException('BankAccount', `${id}`)
    }

    if (!bankAccount.active) {
      throw new BankAccountInactiveException('Financial Transaction cannot be recorded as the bank account is inactive')
    }

    return bankAccount
  }
}