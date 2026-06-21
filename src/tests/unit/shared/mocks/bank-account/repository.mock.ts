import { vi } from 'vitest'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'

export class BankAccountRepositoryMock extends BankAccountRepository {

  private lastId = 0

  create = vi.fn().mockImplementation((bankAccount: BankAccount) => {
    bankAccount.id = ++this.lastId

    bankAccount.createdAt = new Date(Date.now())
    bankAccount.updatedAt = new Date(Date.now())

    return bankAccount
  })

  update = vi.fn().mockImplementation((_, bankAccount: BankAccount) => {
    bankAccount.updatedAt = new Date(Date.now())

    return bankAccount
  })

  delete = vi.fn().mockImplementation(() => { })

  findById = vi.fn().mockImplementation(() => null)

  findMany = vi.fn().mockImplementation(() => [])

  findByCode = vi.fn().mockImplementation(() => null)

  count = vi.fn().mockImplementation(() => 0)
}