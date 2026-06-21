import { Injectable } from '@nestjs/common'
import { UseCase } from '@application/use-cases/use-case'
import { UserCreateEvent } from '@application/observer/events/user/create.event'
import { ConflictException } from '@application/exceptions/conflict.exception'
import { NotFoundException } from '@application/exceptions/not-found.exception'
import { UserGenerateCodeUseCase } from '@application/use-cases/user/generate-code.use-case'
import { UserCreateDTO, userCreateSchema } from '@application/dto/user/create.dto'
import { User } from '@domain/entities/user.entity'
import { People } from '@domain/entities/people.entity'
import { UserType } from '@domain/enums/user.enum'
import { HashService } from '@domain/adapters/crypto/hash.service'
import { UserRepository } from '@domain/repositories/user.repository'
import { PeopleRepository } from '@domain/repositories/people.repository'

@Injectable()
export class UserCreateUseCase extends UseCase<UserCreateEvent> {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly peopleRepository: PeopleRepository,
    private readonly userGenerateCodeUseCase: UserGenerateCodeUseCase,
    private readonly hash: HashService
  ) {
    super()
  }

  async perform(args: UserCreateDTO) {
    const { login, password, peopleId, type, cpfCnpj } = this.validator.validate(userCreateSchema, args)

    const people = await this.getPeopleByIdOrCpfCnpj({ cpfCnpj, peopleId })

    await this.validateUserWithSamePeopleAndType(people.id, type)
    await this.validateUserWithSameLoginAndType(login, type)

    const user = await this.createUserEntity({
      login,
      password,
      type,
      peopleId: people.id,
    })

    const userCreated = await this.registerUser(user)

    await this.observer.notify('events.user.created', { user, people })

    return { user: userCreated, people }
  }

  private async getPeopleByIdOrCpfCnpj({ cpfCnpj, peopleId }: { peopleId?: number, cpfCnpj?: string }) {
    let people: People | null = null

    if (peopleId) {
      people = await this.peopleRepository.findById(peopleId)
    }
    else if (cpfCnpj) {
      people = await this.peopleRepository.findByCpfCnpj(cpfCnpj)
    }

    if (!people) {
      throw new NotFoundException('People', `${peopleId || cpfCnpj}`)
    }

    return people
  }

  private async validateUserWithSamePeopleAndType(peopleId: number, type: UserType) {
    const userWithSamePeopleAndType = await this.userRepository.findByPeopleIdAndType(peopleId, type)

    if (userWithSamePeopleAndType) {
      throw new ConflictException('User', `${peopleId}`, { conflict: ['peopleId', 'type'] })
    }
  }

  private async validateUserWithSameLoginAndType(login: string, type: UserType) {
    const userWithSameLoginAndType = await this.userRepository.findByLoginAndType(login, type)

    if (userWithSameLoginAndType) {
      throw new ConflictException('User', login, { conflict: ['login', 'type'] })
    }
  }

  private async createUserEntity({ login, password, peopleId, type }: { login: string, password: string, peopleId: number, type: UserType }) {
    const { code } = await this.userGenerateCodeUseCase.perform()
    const passwordHashed = await this.hash.hash(password)

    return new User({
      login,
      type,
      code,
      password: passwordHashed,
      peopleId: peopleId,
      active: true,
    })
  }

  private async registerUser(user: User) {
    return await this.userRepository.create(user)
  }
}