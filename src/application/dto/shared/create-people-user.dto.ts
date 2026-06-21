import { UserCreateDTO } from '@application/dto/user/create.dto'
import { PeopleCreateDTO } from '@application/dto/people/create.dto'

export type CreatePeopleAndUserDTO = {
  user: Omit<UserCreateDTO, 'peopleId'>
  people: PeopleCreateDTO
}