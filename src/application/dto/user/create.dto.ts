import { optional, z } from 'zod'
import { UserMessage } from '@application/messages/user.message'
import { PeopleMessage } from '@application/messages/people.message'
import { UserRule } from '@domain/rules/user.rule'
import { UserType } from '@domain/enums/user.enum'
import { extractDigits } from '@shared/utils/string'

export const userCreateSchema = z.object({
  peopleId: z
    .coerce
    .number({ 'required_error': UserMessage.peopleId.required })
    .int()
    .optional(),
  cpfCnpj: z
    .string({ 'required_error': PeopleMessage.name.required })
    .trim()
    .optional()
    .transform(val => val ? extractDigits(val) : undefined),
  login: z
    .string({ 'required_error': UserMessage.login.required })
    .trim()
    .email(UserMessage.login.valueInvalid),
  password: z
    .string({ 'required_error': UserMessage.password.required })
    .trim()
    .regex(UserRule.password.regexp, UserMessage.password.valueInvalid),
  type: z
    .nativeEnum(UserType, { errorMap: () => ({ message: UserMessage.type.valueInvalid }) }),
})
  .refine(({ peopleId, cpfCnpj }) => peopleId || cpfCnpj, UserMessage.peopleIdOrCpfCnpj.required)

export type UserCreateDTO = z.input<typeof userCreateSchema>