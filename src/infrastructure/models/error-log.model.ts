import { ErrorLog as ErrorLogPrisma, Prisma } from '@prisma/client'

export interface ErrorLogModel extends Omit<ErrorLogPrisma, 'details'> {
  details: Prisma.JsonValue
}