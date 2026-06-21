import { UserType } from '@domain/enums/user.enum'
import { QuerySchema } from '@domain/adapters/database/operations'
import { FilterSchema } from '@domain/adapters/database/filters'
import { User, UserProps } from '@domain/entities/user.entity'
import { PeopleFiltersArgs } from '@domain/repositories/people.repository'

export interface UserFilterArgs extends Omit<UserProps, 'settings'> {
  settings: 'json'
  people: PeopleFiltersArgs
}

export type UserFilter = FilterSchema<UserFilterArgs>
export type UserQueryArgs = QuerySchema<UserFilterArgs>

export abstract class UserRepository {

  abstract create(user: User): Promise<User>
  abstract update(id: number, user: User): Promise<User>
  abstract delete(id: number): Promise<void>
  abstract findById(id: number): Promise<User | null>
  abstract findByCode(code: string): Promise<User | null>
  abstract findByPeopleIdAndType(peopleId: number, type: UserType): Promise<User | null>
  abstract findByLoginAndType(login: string, type: UserType): Promise<User | null>
  abstract findMany(args?: UserQueryArgs): Promise<User[]>
}