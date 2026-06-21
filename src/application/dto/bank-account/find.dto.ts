import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'

export const bankAccountFindSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': BankAccountMessage.id.required }),
})

export type BankAccountFindDTO = z.input<typeof bankAccountFindSchema>