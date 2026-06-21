import { z } from 'zod'

const baseZodDate = z.coerce.date()

export const dateQuerySchema = () => z.object({
  equals: baseZodDate.optional(),
  not: baseZodDate.optional(),
  gt: baseZodDate.optional(),
  gte: baseZodDate.optional(),
  lt: baseZodDate.optional(),
  lte: baseZodDate.optional(),
}).optional()