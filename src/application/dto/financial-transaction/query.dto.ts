import { z } from 'zod'
import { FinancialTransactionMessage } from '@application/messages/financial-transaction.message'
import { FinancialTransactionRule } from '@domain/rules/financial-transaction.rule'
import { querySchema } from '@shared/dto/query/query-schema.dto'
import { numberQuerySchema, stringQuerySchema, enumQuerySchema, dateQuerySchema } from '@shared/dto/query/operator-schema.dto'

export const financialTransactionQuerySchema = querySchema().extend({
  bankAccountId: z
    .coerce
    .number({ 'required_error': FinancialTransactionMessage.bankAccountId.required })
    .int(),
  id: numberQuerySchema(),
  type: enumQuerySchema(FinancialTransactionRule.type.enum),
  situation: enumQuerySchema(FinancialTransactionRule.situation.enum),
  title: stringQuerySchema(),
  value: numberQuerySchema(),
  senderRecipient: stringQuerySchema(),
  expiresIn: dateQuerySchema(),
  dateTimeCompetence: dateQuerySchema(),
})

export type FinancialTransactionQueryDTO = z.input<typeof financialTransactionQuerySchema>