import { z } from 'zod'
import { AuthMessage } from '@application/messages/auth.message'
import { UserType } from '@domain/enums/user.enum'

export const authUserSignInSchema = z.object({
  login: z
    .string({ 'required_error': AuthMessage.login.required })
    .min(1, AuthMessage.login.required),
  password: z
    .string({ 'required_error': AuthMessage.password.required })
    .min(1, AuthMessage.password.required),
  type: z
    .nativeEnum(UserType),
})

export type AuthUserSignInDTO = z.input<typeof authUserSignInSchema>