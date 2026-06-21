import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'

export const bankAccountInactivateSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': BankAccountMessage.id.required }),
})

export type BankAccountInactivateDTO = z.input<typeof bankAccountInactivateSchema>