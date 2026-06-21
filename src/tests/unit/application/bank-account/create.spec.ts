import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CodeGeneratorServiceImplementation } from '@infrastructure/adapters/generator/code/code.service'
import { BankAccountCreateUseCase } from '@application/use-cases/bank-account/create.use-case'
import { BankAccountGenerateCodeUseCase } from '@application/use-cases/bank-account/generate-code.use-case'
import { BankAccount } from '@domain/entities/bank-account.entity'
import { CodeGeneratorService } from '@domain/adapters/generator/code/code.service'
import { BankAccountRepository } from '@domain/repositories/bank-account.repository'
import { PeopleRepositoryMock } from '@tests/unit/shared/mocks/people/repository.mock'
import { createApplicationMock } from '@tests/unit/shared/mocks/module.mock'
import { BankAccountRepositoryMock } from '@tests/unit/shared/mocks/bank-account/repository.mock'

describe('Application - BankAccount - UseCase - Create', () => {
  let bankAccountCreateUseCase: BankAccountCreateUseCase
  let bankAccountRepositoryMock: BankAccountRepositoryMock
  let peopleRepositoryMock: PeopleRepositoryMock
  let codeGenerator: CodeGeneratorServiceImplementation

  beforeEach(async () => {
    bankAccountRepositoryMock = new BankAccountRepositoryMock()
    peopleRepositoryMock = new PeopleRepositoryMock()
    codeGenerator = new CodeGeneratorServiceImplementation()

    const module = await createApplicationMock({
      providers: [
        BankAccountCreateUseCase,
        BankAccountGenerateCodeUseCase,
        {
          provide: BankAccountRepository,
          useValue: bankAccountRepositoryMock
        },
        {
          provide: CodeGeneratorService,
          useValue: codeGenerator,
        }
      ]
    })

    bankAccountCreateUseCase = module.get(BankAccountCreateUseCase)
  })

  test('Should be a create bank account', async () => {
    const arrange = {
      peopleId: 1,
      name: 'Bank Account Test',
    }

    vi.spyOn(codeGenerator, 'generate').mockReturnValue('BNK-EXAMPLE')

    const response = await bankAccountCreateUseCase.perform(arrange)

    expect(response.bankAccount).toBeInstanceOf(BankAccount)
    expect(response.bankAccount.id).toEqual(1)
    expect(response.bankAccount.name).toEqual('Bank Account Test')
    expect(response.bankAccount.active).toEqual(true)
    expect(response.bankAccount.balance).toEqual(0)
    expect(response.bankAccount.code).toEqual('BNK-EXAMPLE')
  })
})