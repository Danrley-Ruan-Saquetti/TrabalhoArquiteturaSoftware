import { PrismaClient } from '@prisma/client'
import { FilterSchema } from '@domain/adapters/database/filters'

export type SchemaFilterQuery<T = Record<string, any>> = {
  [x in keyof T]: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'enum' | 'object'
}

export abstract class DatabaseService extends PrismaClient {

  abstract resolveError(error: any, options?: { debugLogError?: boolean }): never
  abstract pipeWhere<Schema extends FilterSchema<any>>(whereConditions?: Schema, queryFilterSchema?: SchemaFilterQuery<any>, options?: { debugFilter?: boolean }): Record<string, Record<string, any>>
}