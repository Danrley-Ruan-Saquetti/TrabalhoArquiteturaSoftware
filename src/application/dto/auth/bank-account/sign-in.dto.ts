import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'

export const authBankAccountSignInSchema = z.object({
  peopleId: z
    .coerce
    .number({ 'required_error': BankAccountMessage.peopleId.required }),
  code: z
    .string({ 'required_error': BankAccountMessage.code.required })
    .min(1, BankAccountMessage.code.required)
})

export type AuthBankAccountSignInDTO = z.input<typeof authBankAccountSignInSchema>