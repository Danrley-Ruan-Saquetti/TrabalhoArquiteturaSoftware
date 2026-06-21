import { vi } from 'vitest'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'

export class FinancialTransactionRepositoryMock extends FinancialTransactionRepository {

  private lastId = 0

  create = vi.fn().mockImplementation((financialTransaction: FinancialTransaction) => {
    financialTransaction.id = ++this.lastId

    financialTransaction.createdAt = new Date(Date.now())
    financialTransaction.updatedAt = new Date(Date.now())

    return financialTransaction
  })

  update = vi.fn().mockImplementation((_, financialTransaction: FinancialTransaction) => {
    financialTransaction.updatedAt = new Date(Date.now())

    return financialTransaction
  })

  updateMany = vi.fn().mockImplementation(() => { })

  delete = vi.fn().mockImplementation(() => { })

  findById = vi.fn().mockImplementation(() => null)

  findMany = vi.fn().mockImplementation(() => [])

  findByCpfCnpj = vi.fn().mockImplementation(() => null)

  count = vi.fn().mockImplementation(() => 0)
}