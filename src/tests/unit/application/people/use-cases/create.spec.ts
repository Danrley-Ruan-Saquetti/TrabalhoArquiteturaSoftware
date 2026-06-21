import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ConflictException } from '@application/exceptions/conflict.exception'
import { PeopleCreateUseCase } from '@application/use-cases/people/create.use-case'
import { PeopleRepository } from '@domain/repositories/people.repository'
import { People, PeopleType } from '@domain/entities/people.entity'
import { PeopleRepositoryMock } from '@tests/unit/shared/mocks/people/repository.mock'
import { createApplicationMock } from '@tests/unit/shared/mocks/module.mock'

describe('Application - People - UseCase - Create', () => {
  let peopleCreateUseCase: PeopleCreateUseCase
  let peopleRepository: PeopleRepositoryMock

  beforeEach(async () => {
    peopleRepository = new PeopleRepositoryMock()

    const module = await createApplicationMock({
      providers: [
        PeopleCreateUseCase,
        {
          provide: PeopleRepository,
          useValue: peopleRepository,
        },
      ],
    })

    peopleCreateUseCase = module.get(PeopleCreateUseCase)
  })

  test('Should be create a people', async () => {
    const arrange = {
      name: 'Dan Ruan',
      cpfCnpj: '102.547.109-13',
      type: PeopleType.NATURAL_PERSON,
    }

    const response = await peopleCreateUseCase.perform(arrange)

    expect(response.people).toBeInstanceOf(People)
    expect(response.people.id).toEqual(1)
    expect(response.people.type).toEqual(PeopleType.NATURAL_PERSON)
    expect(response.people.name).toEqual('Dan Ruan')
    expect(response.people.cpfCnpj).toEqual('10254710913')
    expect(response.people.dateOfBirth).toEqual(null)
    expect(response.people.gender).toEqual(null)
  })

  test('Should dispatch an exception when CPF/CNPJ already exists', async () => {
    const arrange = {
      name: 'Dan Ruan',
      cpfCnpj: '102.547.109-13',
      type: PeopleType.NATURAL_PERSON,
    }

    vi.spyOn(peopleRepository, 'findByCpfCnpj').mockImplementation(() => new People({
      cpfCnpj: '10254710913',
      name: 'Danrley',
      type: PeopleType.NATURAL_PERSON,
    }))

    await expect(async () => {
      try {
        await peopleCreateUseCase.perform(arrange)
      } catch (error: any) {
        if (error instanceof ConflictException) {
          expect(error.details?.conflict.every(path => ['cpfCnpj'].includes(path))).toEqual(true)
        }

        throw error
      }
    }).rejects.toThrow(ConflictException)
  })
})