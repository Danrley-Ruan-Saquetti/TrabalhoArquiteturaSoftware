import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { ConflictException } from '@application/exceptions/conflict.exception'
import { PeopleCreateDTO, peopleCreateSchema } from '@application/dto/people/create.dto'
import { People } from '@domain/entities/people.entity'
import { PeopleRepository } from '@domain/repositories/people.repository'

@Injectable()
export class PeopleCreateUseCase extends UseCase {

  constructor(
    private readonly peopleRepository: PeopleRepository
  ) {
    super()
  }

  async perform(args: PeopleCreateDTO) {
    const { cpfCnpj, name, dateOfBirth, gender, type } = this.validator.validate(peopleCreateSchema, args)

    await this.validatePeopleWithSameCpfCnpj(cpfCnpj)

    const people = new People({
      name,
      cpfCnpj,
      dateOfBirth,
      gender,
      type,
    })

    const peopleCreated = await this.registerPeople(people)

    return { people: peopleCreated }
  }

  private async validatePeopleWithSameCpfCnpj(cpfCnpj: string) {
    const peopleWithSameCpfCnpj = await this.peopleRepository.findByCpfCnpj(cpfCnpj)

    if (peopleWithSameCpfCnpj) {
      throw new ConflictException('People', cpfCnpj, { conflict: ['cpfCnpj'] })
    }
  }

  private async registerPeople(people: People) {
    return await this.peopleRepository.create(people)
  }
}