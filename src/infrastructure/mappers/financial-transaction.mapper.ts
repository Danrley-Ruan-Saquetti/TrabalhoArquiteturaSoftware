import { FinancialTransactionModel } from '@infrastructure/models/financial-transaction.model'
import { FinancialTransaction, FinancialTransactionSettings } from '@domain/entities/financial-transaction.entity'
import { FinancialTransactionSituation, FinancialTransactionType } from '@domain/enums/financial-transaction.enum'
import { Prisma } from '@prisma/client'

export class FinancialTransactionMapper {

  static multiEntityToDatabase(entities: FinancialTransaction[]) {
    return entities.map(entity => FinancialTransactionMapper.databaseToEntity(entity))
  }

  static multiDatabaseToEntity(databaseModels: FinancialTransactionModel[]) {
    return databaseModels.map(databaseModel => FinancialTransactionMapper.databaseToEntity(databaseModel))
  }

  static entityToDatabase(entity: FinancialTransaction) {
    const financialTransactionDatabase: FinancialTransactionModel = {
      id: entity.id,
      bankAccountId: entity.bankAccountId,
      createdAt: entity.createdAt,
      dateTimeCompetence: entity.dateTimeCompetence,
      description: entity.description,
      expiresIn: entity.expiresIn,
      senderRecipient: entity.senderRecipient,
      settings: entity.settings as Prisma.JsonValue,
      situation: entity.situation,
      title: entity.title,
      type: entity.type,
      updatedAt: entity.updatedAt,
      value: entity.valueInCents,
    }

    return financialTransactionDatabase
  }

  static databaseToEntity(databaseModel: FinancialTransactionModel) {
    return new FinancialTransaction({
      id: databaseModel.id,
      bankAccountId: databaseModel.bankAccountId,
      createdAt: databaseModel.createdAt,
      dateTimeCompetence: databaseModel.dateTimeCompetence,
      description: databaseModel.description,
      expiresIn: databaseModel.expiresIn,
      senderRecipient: databaseModel.senderRecipient,
      settings: databaseModel.settings as FinancialTransactionSettings,
      situation: databaseModel.situation as FinancialTransactionSituation,
      title: databaseModel.title,
      type: databaseModel.type as FinancialTransactionType,
      updatedAt: databaseModel.updatedAt,
      value: databaseModel.value / 100,
    })
  }
}