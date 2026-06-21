import { Injectable } from '@nestjs/common'
import { ErrorLogMapper } from '@infrastructure/mappers/error-log.mapper'
import { ErrorLog, ErrorLogProps } from '@domain/entities/error-log.entity'
import { DatabaseService, SchemaFilterQuery } from '@domain/adapters/database/database.service'
import { ErrorLogQueryArgs, ErrorLogRepository } from '@domain/repositories/error-log.repository'
import { Prisma } from '@prisma/client'

@Injectable()
export class ErrorLogRepositoryImplementation extends ErrorLogRepository {

  static QUERY_SCHEMA_FILTER: SchemaFilterQuery<ErrorLogProps> = {
    createdAt: 'date',
    details: 'json',
    id: 'number',
    message: 'string',
    origin: 'string',
    type: 'string',
  }

  constructor(
    private readonly database: DatabaseService
  ) {
    super()
  }

  async create(errorLog: ErrorLog) {
    try {
      const errorLogModel = ErrorLogMapper.entityToDatabase(errorLog)

      const errorLogDatabase = await this.database.errorLog.create({
        data: {
          message: errorLogModel.message,
          type: errorLogModel.type,
          origin: errorLogModel.origin,
          details: errorLogModel.details as Prisma.InputJsonObject,
        }
      })

      return ErrorLogMapper.databaseToEntity(errorLogDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async update(id: string, errorLog: ErrorLog) {
    try {
      const errorLogModel = ErrorLogMapper.entityToDatabase(errorLog)

      const errorLogDatabase = await this.database.errorLog.update({
        where: { id },
        data: {
          message: errorLogModel.message,
          type: errorLogModel.type,
          origin: errorLogModel.origin,
          details: errorLogModel.details as Prisma.InputJsonObject,
        }
      })

      return ErrorLogMapper.databaseToEntity(errorLogDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async delete(id: string) {
    try {
      await this.database.errorLog.delete({ where: { id } })
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findMany(args: ErrorLogQueryArgs = {}) {
    try {
      const errorLogsDatabase = await this.database.errorLog.findMany({
        ...args as any,
        where: this.database.pipeWhere(args.where, ErrorLogRepositoryImplementation.QUERY_SCHEMA_FILTER),
      })

      return ErrorLogMapper.multiDatabaseToEntity(errorLogsDatabase)
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }

  async findById(id: string) {
    try {
      const errorLogDatabase = await this.database.errorLog.findUnique({ where: { id } })

      return errorLogDatabase ? ErrorLogMapper.databaseToEntity(errorLogDatabase) : null
    } catch (error: any) {
      this.database.resolveError(error)
    }
  }
}