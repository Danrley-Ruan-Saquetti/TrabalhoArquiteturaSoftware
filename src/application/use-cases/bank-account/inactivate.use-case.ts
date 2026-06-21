import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { BankAccountInactiveException } from '@application/exceptions/bank-account-inactive.exception'
import { BankAccountInactivateBalanceEvent } from '@application/observer/events/bank-account/inactivate.event'
import { BankAccountInactivateDTO, bankAccountInactivateSchema } from '@application/dto/bank-account/inactivate.dto'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountInactivateUseCase extends UseCase<BankAccountInactivateBalanceEvent> {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {
    super()
  }

  async perform(args: BankAccountInactivateDTO) {
    const { id } = this.validator.validate(bankAccountInactivateSchema, args)

    const bankAccount = await this.bankAccountRepository.findById(id)

    if (!bankAccount) {
      throw new NotFoundException('Bank Account', `${id}`)
    }

    if (!bankAccount.active) {
      throw new BankAccountInactiveException('Bank account is already inactive')
    }

    bankAccount.active = false

    await this.bankAccountRepository.update(bankAccount.id, bankAccount)

    await this.observer.notify('events.bank-account.inactivated', { bankAccount })

    return { bankAccount }
  }
}