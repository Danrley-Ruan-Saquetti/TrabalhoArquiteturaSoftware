import { z } from 'zod'

export const querySchema = () => z.object({
  size: z
    .coerce
    .number()
    .positive()
    .default(10),
  page: z
    .coerce
    .number()
    .positive()
    .default(1)
    .transform(page => page - 1),
})