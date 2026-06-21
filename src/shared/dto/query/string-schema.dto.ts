import { z } from 'zod'

const baseZodString = z.string()
const baseUnionZodString = z.union([baseZodString, z.array(baseZodString)]).optional().transform(val => !val ? undefined : Array.isArray(val) ? val : [val])

export const stringQuerySchema = () => z.object({
  equals: baseZodString.optional(),
  not: baseZodString.optional(),
  in: baseUnionZodString,
  notIn: baseUnionZodString,
  startsWith: baseZodString.optional(),
  endsWith: baseZodString.optional(),
}).optional()