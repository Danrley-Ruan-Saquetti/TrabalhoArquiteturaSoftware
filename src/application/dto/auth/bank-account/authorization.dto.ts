import { z } from 'zod'

export const authBankAccountAuthorizationSchema = z.object({
  token: z
    .string()
    .trim()
})

export type AuthBankAccountAuthorizationDTO = z.input<typeof authBankAccountAuthorizationSchema>