import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { FinancialTransactionCreateUseCase } from '@application/use-cases/financial-transaction/create.use-case'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { FinancialTransaction } from '@domain/entities/financial-transaction.entity'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'
import { FinancialTransactionRepository } from '@domain/repositories/financial-transaction.repository'
import { FinancialTransactionSituation, FinancialTransactionType } from '@domain/enums/financial-transaction.enum'
import { createApplicationMock } from '@tests/unit/shared/mocks/module.mock'
import { BankAccountRepositoryMock } from '@tests/unit/shared/mocks/bank-account/repository.mock'
import { FinancialTransactionRepositoryMock } from '@tests/unit/shared/mocks/financial-transaction/repository.mock'

describe('Application - FinancialTransaction - UseCase - Create', () => {
  let financialTransactionCreateUseCase: FinancialTransactionCreateUseCase
  let financialTransactionRepositoryMock: FinancialTransactionRepositoryMock
  let bankAccountRepositoryMock: BankAccountRepositoryMock

  beforeEach(async () => {
    financialTransactionRepositoryMock = new FinancialTransactionRepositoryMock()
    bankAccountRepositoryMock = new BankAccountRepositoryMock()

    const module = await createApplicationMock({
      providers: [
        FinancialTransactionCreateUseCase,
        {
          provide: FinancialTransactionRepository,
          useValue: financialTransactionRepositoryMock
        },
        {
          provide: BankAccountRepository,
          useValue: bankAccountRepositoryMock
        },
      ]
    })

    financialTransactionCreateUseCase = module.get(FinancialTransactionCreateUseCase)
  })

  test('Should be a create financial transaction', async () => {
    const arrange = {
      bankAccountId: 1,
      title: 'Teste',
      value: 10,
      type: FinancialTransactionType.INCOME,
      senderRecipient: 'John Doe',
    }

    vi.spyOn(bankAccountRepositoryMock, 'findById').mockImplementation(id => new BankAccount({
      id,
      peopleId: 1,
      code: 'BNK-EXAMPLE',
      name: 'Example',
      active: true,
      balance: 100,
    }))

    const response = await financialTransactionCreateUseCase.perform(arrange)

    expect(response.financialTransaction).toBeInstanceOf(FinancialTransaction)
    expect(response.financialTransaction.id).toEqual(1)
    expect(response.financialTransaction.bankAccountId).toEqual(1)
    expect(response.financialTransaction.title).toEqual('Teste')
    expect(response.financialTransaction.type).toEqual(FinancialTransactionType.INCOME)
    expect(response.financialTransaction.value).toEqual(10)
    expect(response.financialTransaction.senderRecipient).toEqual('John Doe')
    expect(response.financialTransaction.description).toEqual('')
    expect(response.financialTransaction.situation).toEqual(FinancialTransactionSituation.PENDING)
    expect(response.financialTransaction.settings).toEqual(FinancialTransaction.getDefaultSettings())
    expect(response.financialTransaction.expiresIn).toEqual(null)
  })

  test('Should not record financial transaction when bank account is not found', async () => {
    const arrange = {
      bankAccountId: 1,
      title: 'Teste',
      value: 10,
      type: FinancialTransactionType.INCOME,
      senderRecipient: 'John Doe',
    }

    await expect(async () => {
      try {
        await financialTransactionCreateUseCase.perform(arrange)
      } catch (error: any) {
        if (error instanceof NotFoundException) {
          expect(error.details?.identifier).toEqual('1')
        }

        throw error
      }
    }).rejects.toThrow(NotFoundException)
  })

  test('It must be possible to register a financial transaction with the status of Lated', async () => {
    const date = new Date(Date.now())
    date.setMinutes(date.getMinutes() - 1)

    const arrange = {
      bankAccountId: 1,
      title: 'Teste',
      value: 10,
      type: FinancialTransactionType.INCOME,
      senderRecipient: 'John Doe',
      expiresIn: date
    }

    vi.spyOn(bankAccountRepositoryMock, 'findById').mockImplementation(id => new BankAccount({
      id,
      peopleId: 1,
      code: 'BNK-EXAMPLE',
      name: 'Example',
      active: true,
      balance: 100,
    }))

    const response = await financialTransactionCreateUseCase.perform(arrange)

    expect(response.financialTransaction).toBeInstanceOf(FinancialTransaction)
    expect(response.financialTransaction.id).toEqual(1)
    expect(response.financialTransaction.bankAccountId).toEqual(1)
    expect(response.financialTransaction.type).toEqual(FinancialTransactionType.INCOME)
    expect(response.financialTransaction.title).toEqual('Teste')
    expect(response.financialTransaction.value).toEqual(10)
    expect(response.financialTransaction.senderRecipient).toEqual('John Doe')
    expect(response.financialTransaction.description).toEqual('')
    expect(response.financialTransaction.situation).toEqual(FinancialTransactionSituation.LATED)
    expect(response.financialTransaction.settings).toEqual(FinancialTransaction.getDefaultSettings())
    expect(response.financialTransaction.expiresIn).toEqual(date)
  })
})