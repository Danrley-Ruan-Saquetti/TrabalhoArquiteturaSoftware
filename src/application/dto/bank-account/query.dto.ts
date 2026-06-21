import { z } from 'zod'
import { BankAccountMessage } from '@application/messages/bank-account.message'
import { querySchema } from '@shared/dto/query/query-schema.dto'
import { stringQuerySchema, numberQuerySchema, booleanQuerySchema } from '@shared/dto/query/operator-schema.dto'

export const bankAccountQuerySchema = querySchema().extend({
  peopleId: z
    .coerce
    .number({ 'required_error': BankAccountMessage.peopleId.required })
    .int(),
  name: stringQuerySchema(),
  code: stringQuerySchema(),
  active: booleanQuerySchema(),
})

export type BankAccountQueryDTO = z.input<typeof bankAccountQuerySchema>