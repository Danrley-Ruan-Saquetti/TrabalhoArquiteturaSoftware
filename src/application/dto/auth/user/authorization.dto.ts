import { z } from 'zod'

export const authUserAuthorizationSchema = z.object({
  token: z
    .string()
    .trim()
})

export type AuthUserAuthorizationDTO = z.input<typeof authUserAuthorizationSchema>