import { QuerySchema } from '@domain/adapters/database/operations'
import { FilterSchema } from '@domain/adapters/database/filters'
import { People, PeopleProps } from '@domain/entities/people.entity'

export interface PeopleFiltersArgs extends Omit<PeopleProps, 'type' | 'gender'> {
  type: 'enum'
  gender: 'enum'
}

export type PeopleFilter = FilterSchema<PeopleFiltersArgs>
export type PeopleQueryArgs = QuerySchema<PeopleFiltersArgs>

export abstract class PeopleRepository {

  abstract create(people: People): Promise<People>
  abstract update(id: number, people: People): Promise<People>
  abstract delete(id: number): Promise<void>
  abstract findById(id: number): Promise<People | null>
  abstract findMany(args?: PeopleQueryArgs): Promise<People[]>
  abstract findByCpfCnpj(cpfCnpj: string): Promise<People | null>
}