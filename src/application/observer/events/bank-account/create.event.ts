import { User } from '@domain/entities/user.entity'
import { BankAccount } from '@domain/entities/bank-account.entity'

export interface BankAccountCreateEvent {
  'events.bank-account.created': { bankAccount: BankAccount, user: User }
}