import { z } from 'zod'

const baseZodNumber = z.coerce.number()
const baseUnionZodNumber = z
  .union([
    baseZodNumber,
    z.array(baseZodNumber)
  ])
  .optional()
  .transform(val => !val ? undefined : Array.isArray(val) ? val : [val])

export const numberQuerySchema = () => z.object({
  equals: baseZodNumber.optional(),
  not: baseZodNumber.optional(),
  in: baseUnionZodNumber,
  notIn: baseUnionZodNumber,
  gt: baseZodNumber.optional(),
  gte: baseZodNumber.optional(),
  lt: baseZodNumber.optional(),
  lte: baseZodNumber.optional(),
}).optional()