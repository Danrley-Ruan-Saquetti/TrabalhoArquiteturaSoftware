import { Injectable } from '@nestjs/common'
import { BankAccountMapper } from '@infrastructure/mappers/bank-account.mapper'
import { DatabaseService, SchemaFilterQuery } from '@domain/adapters/database/database.service'
import { BankAccount, BankAccountProps } from '@domain/entities/bank-account.entity'
import { BankAccountQueryArgs, BankAccountRepository } from '@domain/repositories/bank-account.repository'

@Injectable()
export class BankAccountRepositoryImplementation extends BankAccountRepository {

  static QUERY_SCHEMA_FILTER: SchemaFilterQuery<BankAccountProps> = {
    active: 'boolean',
    balance: 'number',
    code: 'string',
    name: 'string',
    peopleId: 'number',
    createdAt: 'date',
    id: 'number',
    updatedAt: 'date',
  }

  constructor(
    private readonly database: DatabaseService
  ) {
    super()
  }

  async create(bankAccount: BankAccount) {
    try {
      const bankAccountModel = BankAccountMapper.entityToDatabase(bankAccount)

      const bankAccountDatabase = await this.database.bankAccount.create({
        data: {
          code: bankAccountModel.code,
          name: bankAccountModel.name,
          active: bankAccountModel.active,
          balance: bankAccountModel.balance,
          peopleId: bankAccountModel.peopleId,
        }
      })

      return BankAccountMapper.databaseToEntity(bankAccountDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async update(id: number, bankAccount: BankAccount) {
    try {
      const bankAccountModel = BankAccountMapper.entityToDatabase(bankAccount)

      const bankAccountDatabase = await this.database.bankAccount.update({
        where: { id },
        data: {
          active: bankAccountModel.active,
          balance: bankAccountModel.balance,
          code: bankAccountModel.code,
          name: bankAccountModel.name,
          peopleId: bankAccountModel.peopleId,
        }
      })

      return BankAccountMapper.databaseToEntity(bankAccountDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async delete(id: number) {
    try {
      await this.database.bankAccount.delete({ where: { id } })
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findMany(args: BankAccountQueryArgs = {}) {
    try {
      const bankAccountsDatabase = await this.database.bankAccount.findMany({
        ...args as any,
        where: this.database.pipeWhere(args.where, BankAccountRepositoryImplementation.QUERY_SCHEMA_FILTER),
      })

      return BankAccountMapper.multiDatabaseToEntity(bankAccountsDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findById(id: number) {
    try {
      const bankAccountDatabase = await this.database.bankAccount.findUnique({ where: { id } })

      return bankAccountDatabase ? BankAccountMapper.databaseToEntity(bankAccountDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findByCode(code: string) {
    try {
      const bankAccountDatabase = await this.database.bankAccount.findUnique({ where: { code } })

      return bankAccountDatabase ? BankAccountMapper.databaseToEntity(bankAccountDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async count(args: Pick<BankAccountQueryArgs, 'where'> = {}) {
    try {
      const count = await this.database.bankAccount.count({
        where: this.database.pipeWhere(args.where, BankAccountRepositoryImplementation.QUERY_SCHEMA_FILTER),
      })

      return count
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }
}