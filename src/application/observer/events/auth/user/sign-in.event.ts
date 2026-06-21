import { User } from '@domain/entities/user.entity'

export interface AuthUserSignInEvent {
  'events.auth.user.sign-in': { user: User }
}