import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'
import { BankAccountRule } from '@domain/rules/bank-account.rule'

export const bankAccountUpdateSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': BankAccountMessage.id.required })
    .int(),
  name: z
    .string({ 'required_error': BankAccountMessage.name.required })
    .trim()
    .min(BankAccountRule.minCharacters, { message: BankAccountMessage.name.rangeCharacters })
    .max(BankAccountRule.maxCharacters, { message: BankAccountMessage.name.rangeCharacters })
    .optional(),
})

export type BankAccountUpdateDTO = z.input<typeof bankAccountUpdateSchema>