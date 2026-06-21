import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { QueryMetadata } from '@application/types/query-metadata.type'
import { bankAccountQuerySchema, BankAccountQueryDTO } from '@application/dto/bank-account/query.dto'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountQueryUseCase extends UseCase {

  constructor(
    private readonly bankAccountRepository: BankAccountRepository
  ) {
    super()
  }

  async perform(args: BankAccountQueryDTO) {
    const { peopleId, page, size, ...filters } = this.validator.validate(bankAccountQuerySchema, args)

    const total = await this.bankAccountRepository.count({
      where: {
        ...filters,
        peopleId,
      },
    })

    const bankAccounts = await this.bankAccountRepository.findMany({
      where: {
        ...filters,
        peopleId
      },
      take: size,
      skip: size * page
    })

    const metadata: QueryMetadata = {
      size: bankAccounts.length,
      page: page + 1,
      totalSize: total,
      totalPages: Math.ceil(total / size),
    }

    return { bankAccounts, metadata }
  }
}