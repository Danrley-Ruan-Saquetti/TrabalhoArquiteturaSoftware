import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { UserCreateUseCase } from '@application/use-cases/user/create.use-case'
import { PeopleCreateUseCase } from '@application/use-cases/people/create.use-case'
import { CreatePeopleAndUserDTO } from '@application/dto/shared/create-people-user.dto'

@Injectable()
export class CreatePeopleAndUserUseCase extends UseCase {

  get observerCreatePeople() { return this.createPeopleUseCase.observer }
  get observerCreateUser() { return this.createUserUseCase.observer }

  constructor(
    private readonly createPeopleUseCase: PeopleCreateUseCase,
    private readonly createUserUseCase: UserCreateUseCase,
  ) {
    super()
  }

  async perform(args: CreatePeopleAndUserDTO) {
    const { people } = await this.createPeopleUseCase.perform({ ...args.people })
    const { user } = await this.createUserUseCase.perform({ ...args.user, peopleId: people.id })

    return { user, people }
  }
}