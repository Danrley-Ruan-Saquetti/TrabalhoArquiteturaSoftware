import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { UnauthorizedException } from '@application/exceptions/unauthorized.exception'
import { BankAccountFindDTO, bankAccountFindSchema } from '@application/dto/bank-account/find.dto'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountFindUseCase extends UseCase {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {
    super()
  }

  async perform(args: BankAccountFindDTO) {
    const { id } = this.validator.validate(bankAccountFindSchema, args)

    const bankAccount = await this.bankAccountRepository.findById(id)

    if (!bankAccount) {
      throw new NotFoundException('Bank Account', `${id}`)
    }

    return { bankAccount }
  }
}