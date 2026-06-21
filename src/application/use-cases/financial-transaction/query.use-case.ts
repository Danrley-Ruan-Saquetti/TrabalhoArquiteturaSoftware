import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { QueryMetadata } from '@application/types/query-metadata.type'
import { financialTransactionQuerySchema, FinancialTransactionQueryDTO } from '@application/dto/financial-transaction/query.dto'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'

@Injectable()
export class FinancialTransactionQueryUseCase extends UseCase {

  constructor(
    private readonly financialTransactionRepository: FinancialTransactionRepository
  ) {
    super()
  }

  async perform(args: FinancialTransactionQueryDTO) {
    const { bankAccountId, page, size, ...filters } = this.validator.validate(financialTransactionQuerySchema, args)

    const total = await this.financialTransactionRepository.count({
      where: {
        ...filters,
        bankAccountId,
      },
    })

    const financialTransactions = await this.financialTransactionRepository.findMany({
      where: {
        ...filters,
        bankAccountId,
      },
      take: size,
      skip: size * page,
    })

    const metadata: QueryMetadata = {
      size: financialTransactions.length,
      page: page + 1,
      totalSize: total,
      totalPages: Math.ceil(total / size),
    }

    return { financialTransactions, metadata }
  }
}