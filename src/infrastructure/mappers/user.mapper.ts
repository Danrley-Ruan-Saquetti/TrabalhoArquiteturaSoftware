import { UserModel } from '@infrastructure/models/user.model'
import { User } from '@domain/entities/user.entity'
import { UserType } from '@domain/enums/user.enum'

export class UserMapper {

  static multiEntityToDatabase(entities: User[]) {
    return entities.map(entity => UserMapper.databaseToEntity(entity))
  }

  static multiDatabaseToEntity(databaseModels: UserModel[]) {
    return databaseModels.map(databaseModel => UserMapper.databaseToEntity(databaseModel))
  }

  static entityToDatabase(entity: User) {
    const userDatabase: UserModel = {
      id: entity.id,
      active: entity.active,
      code: entity.code,
      createdAt: entity.createdAt,
      lastAccess: entity.lastAccess,
      login: entity.login,
      password: entity.password,
      peopleId: entity.peopleId,
      type: entity.type,
      updatedAt: entity.updatedAt,
    }

    return userDatabase
  }

  static databaseToEntity(databaseModel: UserModel) {
    return new User({
      id: databaseModel.id,
      active: databaseModel.active,
      code: databaseModel.code,
      createdAt: databaseModel.createdAt,
      lastAccess: databaseModel.lastAccess,
      login: databaseModel.login,
      password: databaseModel.password,
      peopleId: databaseModel.peopleId,
      type: databaseModel.type as UserType,
      updatedAt: databaseModel.updatedAt,
    })
  }
}