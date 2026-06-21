import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'

export const bankAccountUpdateBalanceSchema = z.object({
  bankAccountId: z
    .coerce
    .number({ 'required_error': BankAccountMessage.id.required })
    .int(),
  type: z
    .enum(['IN', 'OUT'], { errorMap: () => ({ message: 'Invalid bank account balance change type' }) }),
  value: z
    .coerce
    .number({ 'required_error': 'Bank transaction amount is required' })
    .positive('Bank transaction amount must have greater than 0 (zero)')
})

export type BankAccountUpdateBalanceDTO = z.input<typeof bankAccountUpdateBalanceSchema>