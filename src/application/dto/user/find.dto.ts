import { z } from 'zod'
import { UserMessage } from '@application/messages/user.message'

export const userFindSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': UserMessage.peopleId.required })
})

export type UserFindDTO = z.input<typeof userFindSchema>