import { User } from '@domain/entities/user.entity'
import { BankAccount } from '@domain/entities/bank-account.entity'

export interface AuthBankAccountSignInEvent {
  'events.auth.bank-account.sign-in': { bankAccount: BankAccount }
}