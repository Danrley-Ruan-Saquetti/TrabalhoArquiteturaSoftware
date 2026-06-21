import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { BankAccountCreateEvent } from '@application/observer/events/bank-account/create.event'
import { BankAccountGenerateCodeUseCase } from '@application/use-cases/bank-account/generate-code.use-case'
import { BankAccountCreateDTO, bankAccountCreateSchema } from '@application/dto/bank-account/create.dto'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountCreateUseCase extends UseCase<BankAccountCreateEvent> {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly bankAccountGenerateCodeUseCase: BankAccountGenerateCodeUseCase,
  ) {
    super()
  }

  async perform(args: BankAccountCreateDTO) {
    const { name, peopleId } = this.validator.validate(bankAccountCreateSchema, args)

    const { code } = await this.bankAccountGenerateCodeUseCase.perform()

    const bankAccount = new BankAccount({
      name,
      peopleId,
      code,
      balance: 0,
      active: true,
    })

    await this.bankAccountRepository.create(bankAccount)

    return { bankAccount }
  }
}