import { z } from 'zod'
import { FinancialTransactionMessage } from '@application/messages/financial-transaction.message'

export const financialTransactionUpdateSituationSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': FinancialTransactionMessage.id.required }),
  bankAccountId: z
    .coerce
    .number({ 'required_error': FinancialTransactionMessage.bankAccountId.required }),
})

export type FinancialTransactionUpdateSituationDTO = z.input<typeof financialTransactionUpdateSituationSchema>