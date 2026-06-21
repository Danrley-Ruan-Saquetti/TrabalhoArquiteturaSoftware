import { vi } from 'vitest'
import { People } from '@domain/entities/people.entity'
import { PeopleRepository } from '@domain/repositories/people.repository'

export class PeopleRepositoryMock extends PeopleRepository {

  private lastId = 0

  create = vi.fn().mockImplementation((people: People) => {
    people.id = ++this.lastId

    people.createdAt = new Date(Date.now())
    people.updatedAt = new Date(Date.now())

    return people
  })

  update = vi.fn().mockImplementation((_, people: People) => {
    people.updatedAt = new Date(Date.now())

    return people
  })

  delete = vi.fn().mockImplementation(() => { })

  findById = vi.fn().mockImplementation(() => null)

  findMany = vi.fn().mockImplementation(() => [])

  findByCpfCnpj = vi.fn().mockImplementation(() => null)
}