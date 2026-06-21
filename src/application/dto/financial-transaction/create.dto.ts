import { z } from 'zod'
import { FinancialTransactionMessage } from '@application/messages/financial-transaction.message'
import { FinancialTransactionRule } from '@domain/rules/financial-transaction.rule'
import { FinancialTransactionTypeOccurrence } from '@domain/enums/financial-transaction.enum'

export const financialTransactionCreateSchema = z.object({
  bankAccountId: z
    .coerce
    .number({ 'required_error': FinancialTransactionMessage.bankAccountId.required })
    .int(),
  title: z
    .string({ 'required_error': FinancialTransactionMessage.title.required })
    .trim()
    .min(FinancialTransactionRule.title.minCharacters, { message: FinancialTransactionMessage.title.rangeCharacters })
    .max(FinancialTransactionRule.title.maxCharacters, { message: FinancialTransactionMessage.title.rangeCharacters }),
  description: z
    .string()
    .trim()
    .default(FinancialTransactionRule.description.default),
  value: z
    .coerce
    .number({
      'required_error': FinancialTransactionMessage.value.required,
      'invalid_type_error': FinancialTransactionMessage.value.mustBePositive,
    })
    .positive({ message: FinancialTransactionMessage.value.mustBePositive }),
  timesToRepeat: z
    .coerce
    .number()
    .int()
    .nullish()
    .default(FinancialTransactionRule.timesToRepeat.default),
  type: z
    .enum(FinancialTransactionRule.type.enum, { errorMap: () => ({ message: FinancialTransactionMessage.type.enumInvalid }) }),
  typeOccurrence: z
    .enum(FinancialTransactionRule.typeOccurrence.enum, {
      errorMap: () => ({ message: FinancialTransactionMessage.typeOccurrence.enumInvalid }),
    })
    .default(FinancialTransactionRule.typeOccurrence.default),
  frequency: z
    .enum(FinancialTransactionRule.frequency.enum, {
      errorMap: () => ({ message: FinancialTransactionMessage.frequency.enumInvalid }),
    })
    .optional()
    .nullable()
    .default(null),
  senderRecipient: z
    .string({ 'required_error': FinancialTransactionMessage.senderRecipient.required })
    .trim()
    .min(1, FinancialTransactionMessage.senderRecipient.required),
  expiresIn: z
    .coerce
    .date()
    .nullish(),
  dateTimeCompetence: z.coerce
    .date()
    .default(() => new Date(Date.now())),
})
  .transform(({ typeOccurrence, timesToRepeat, expiresIn, ...rest }) => {
    if (timesToRepeat) { typeOccurrence = timesToRepeat > 0 ? FinancialTransactionTypeOccurrence.PROGRAMMATIC : FinancialTransactionTypeOccurrence.SINGLE }
    else { timesToRepeat = typeOccurrence == FinancialTransactionTypeOccurrence.SINGLE ? null : timesToRepeat }

    return { ...rest, typeOccurrence, timesToRepeat, expiresIn }
  })
  .refine(({ typeOccurrence, timesToRepeat }) => typeOccurrence != FinancialTransactionTypeOccurrence.PROGRAMMATIC || !!timesToRepeat, {
    message: FinancialTransactionMessage.timesToRepeat.mustBePositive,
    path: ['timesToRepeat'],
  })
  .refine(
    ({ typeOccurrence, frequency }) => typeOccurrence != FinancialTransactionTypeOccurrence.PROGRAMMATIC || (!!frequency && frequency != null),
    { message: FinancialTransactionMessage.frequency.enumInvalid, path: ['frequency'] },
  )

export type FinancialTransactionCreateDTO = z.input<typeof financialTransactionCreateSchema>