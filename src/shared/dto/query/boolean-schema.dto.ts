import { z } from 'zod'

const baseZodBoolean = z.coerce.boolean()

export const booleanQuerySchema = () => z.object({
  equals: baseZodBoolean.optional(),
  not: baseZodBoolean.optional(),
}).optional()