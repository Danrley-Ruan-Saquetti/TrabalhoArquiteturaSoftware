import { z } from 'zod'

export const generateCodeSchema = z.object({
  attempts: z
    .coerce
    .number()
    .int()
    .min(1, 'Number of attempts must be greater than 0 (zero)')
    .default(3)
})

export type GenerateCodeDTO = z.input<typeof generateCodeSchema>