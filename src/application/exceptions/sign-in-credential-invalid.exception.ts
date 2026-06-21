import { RuntimeException } from '@shared/exceptions'

export class SignInCredentialInvalidException extends RuntimeException {

  constructor(details?: Record<string, unknown>) {
    super('Login or password invalid', details)
  }
}