import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { PeopleUpdateDTO, peopleUpdateSchema } from '@application/dto/people/update.dto'
import { PeopleRepository } from '@domain/repositories/people.repository'

@Injectable()
export class PeopleUpdateUseCase extends UseCase {

  constructor(
    private readonly peopleRepository: PeopleRepository,
  ) {
    super()
  }

  async perform(args: PeopleUpdateDTO) {
    const { id, dateOfBirth, gender, name } = this.validator.validate(peopleUpdateSchema, args)

    const people = await this.findPeople(id)

    if (typeof dateOfBirth != 'undefined') people.dateOfBirth = dateOfBirth
    if (typeof gender != 'undefined') people.gender = gender
    if (name) people.name = name

    const peopleUpdate = await this.peopleRepository.update(people.id, people)

    return { people: peopleUpdate }
  }

  private async findPeople(id: number) {
    const people = await this.peopleRepository.findById(id)

    if (!people) {
      throw new NotFoundException('People', `${id}`)
    }

    return people
  }
}