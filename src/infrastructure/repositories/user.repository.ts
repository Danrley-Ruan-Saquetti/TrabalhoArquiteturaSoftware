import { Injectable } from '@nestjs/common'
import { UserMapper } from '@infrastructure/mappers/user.mapper'
import { UserType } from '@domain/enums/user.enum'
import { PeopleProps } from '@domain/entities/people.entity'
import { User, UserProps } from '@domain/entities/user.entity'
import { UserQueryArgs, UserRepository } from '@domain/repositories/user.repository'
import { DatabaseService, SchemaFilterQuery } from '@domain/adapters/database/database.service'

@Injectable()
export class UserRepositoryImplementation extends UserRepository {

  static QUERY_SCHEMA_FILTER: SchemaFilterQuery<UserProps & { people: PeopleProps }> = {
    active: 'boolean',
    code: 'string',
    createdAt: 'date',
    id: 'number',
    lastAccess: 'date',
    login: 'string',
    password: 'string',
    peopleId: 'number',
    type: 'enum',
    updatedAt: 'date',
    people: 'object'
  }

  constructor(
    private readonly database: DatabaseService
  ) {
    super()
  }

  async create(user: User) {
    try {
      const userModel = UserMapper.entityToDatabase(user)

      const userDatabase = await this.database.user.create({
        data: {
          code: userModel.code,
          login: userModel.login,
          password: userModel.password,
          type: userModel.type,
          active: userModel.active,
          lastAccess: userModel.lastAccess,
          people: {
            connect: { id: userModel.peopleId }
          }
        }
      })

      return UserMapper.databaseToEntity(userDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async update(id: number, user: User) {
    try {
      const userModel = UserMapper.entityToDatabase(user)

      const userDatabase = await this.database.user.update({
        where: { id },
        data: {
          code: userModel.code,
          login: userModel.login,
          password: userModel.password,
          type: userModel.type,
          active: userModel.active,
          lastAccess: userModel.lastAccess,
          peopleId: userModel.peopleId,
        }
      })

      return UserMapper.databaseToEntity(userDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async delete(id: number) {
    try {
      await this.database.user.delete({ where: { id } })
    } catch (error: any) {

      throw error
    }
  }

  async findMany(args: UserQueryArgs = {}) {
    try {
      const usersDatabase = await this.database.user.findMany({
        ...args as any,
        where: this.database.pipeWhere(args.where, UserRepositoryImplementation.QUERY_SCHEMA_FILTER),
      })

      return UserMapper.multiDatabaseToEntity(usersDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findById(id: number) {
    try {
      const userDatabase = await this.database.user.findUnique({ where: { id } })

      return userDatabase ? UserMapper.databaseToEntity(userDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findByCode(code: string) {
    try {
      const userDatabase = await this.database.user.findUnique({ where: { code } })

      return userDatabase ? UserMapper.databaseToEntity(userDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findByPeopleIdAndType(peopleId: number, type: UserType) {
    try {
      const userDatabase = await this.database.user.findFirst({ where: { peopleId, type } })

      return userDatabase ? UserMapper.databaseToEntity(userDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findByLoginAndType(login: string, type: UserType) {
    try {
      const userDatabase = await this.database.user.findFirst({ where: { login, type } })

      return userDatabase ? UserMapper.databaseToEntity(userDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }
}