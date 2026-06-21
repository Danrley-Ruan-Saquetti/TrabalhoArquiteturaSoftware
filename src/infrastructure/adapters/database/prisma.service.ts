import { Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { QueryFilterBuilder } from '@infrastructure/adapters/database/query-filter-builder'
import { DatabaseServerException } from '@infrastructure/adapters/database/exceptions/server.exception'
import { DatabaseClientException } from '@infrastructure/adapters/database/exceptions/client.exception'
import { PRISMA_CLIENT_ERRORS_CODE } from '@infrastructure/adapters/database/errors.code'
import { DatabaseService, SchemaFilterQuery } from '@domain/adapters/database/database.service'

@Injectable()
export class PrismaDatabaseService extends DatabaseService implements OnModuleInit {

  constructor(
  ) {
    super({ log: [{ level: 'error', emit: 'event' }] })
  }

  async onModuleInit() {
    await this.$connect()

    // @ts-expect-error
    this.$on('error', async error => await this.onError(error))

    // @ts-expect-error
    this.$on('query', ({ query, params }) => {
      console.log(query, params)
    })
  }

  private async onError(error: any) {
    await this.errorLog.create({
      data: {
        type: 'DATABASE',
        origin: `database.${error.target ?? 'unknown'}`,
        message: error.message ?? 'Error',
      }
    })
  }

  resolveError(error: any, options?: { debugLogError?: boolean }): never {
    if (options?.debugLogError) {
      console.log({ message: error?.message || 'Error', ...error })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseClientException(PRISMA_CLIENT_ERRORS_CODE[error.code] || '')
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new DatabaseClientException('Validation error: Check your query')
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new DatabaseServerException('An unknown error occurred in the database')
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new DatabaseServerException('A severe error occurred in the Prisma engine')
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new DatabaseServerException('Failed to initialize Prisma Client')
    }

    throw new DatabaseServerException('Operation database failed. Error: ' + error.message || '')
  }

  pipeWhere(whereConditions: Record<string, Record<string, any>> = {}, queryFilterSchema: SchemaFilterQuery<any> = {}, options: { debugFilter?: boolean } = {}) {
    const conditions = new QueryFilterBuilder(queryFilterSchema).build(whereConditions)

    if (options.debugFilter) {
      console.log(JSON.stringify(conditions, null, 2))
    }

    return conditions
  }
}