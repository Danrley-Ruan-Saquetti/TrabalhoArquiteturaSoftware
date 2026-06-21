import { z } from 'zod'

export const financialTransactionUpdateDelayedSchema = z.object({
  limit: z
    .number()
    .min(1, 'Limit must have greater than 0 (zero)')
    .optional()
})

export type FinancialTransactionUpdateDelayedDTO = z.input<typeof financialTransactionUpdateDelayedSchema>